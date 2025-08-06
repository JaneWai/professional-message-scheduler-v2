import React from 'react'
import { AlertTriangle, CheckCircle, Lightbulb, Heart } from 'lucide-react'

interface AnalysisResult {
  score: number
  issues: Array<{
    type: 'vulgar' | 'negative' | 'aggressive' | 'dismissive'
    word: string
    suggestion: string
    severity: 'high' | 'medium' | 'low'
  }>
  suggestions: string[]
  mentalHealthScore: number
}

interface MessageAnalysisProps {
  content: string
  onSuggestionApply: (newContent: string) => void
}

export const MessageAnalysis: React.FC<MessageAnalysisProps> = ({ content, onSuggestionApply }) => {
  const analyzeMessage = (text: string): AnalysisResult => {
    const vulgarWords = ['fuck', 'shit', 'damn', 'stupid', 'dumb', 'idiot', 'moron', 'retard', 'lame', 'suck', 'crap']
    const negativeWords = ['hate', 'terrible', 'awful', 'worst', 'horrible', 'disgusting', 'pathetic', 'useless', 'worthless']
    const aggressiveWords = ['must', 'should', 'need to', 'have to', 'demand', 'require', 'insist', 'force']
    const dismissiveWords = ['whatever', 'obviously', 'clearly', 'just', 'simply', 'merely', 'only']

    const issues: AnalysisResult['issues'] = []
    const suggestions: string[] = []
    let score = 100
    let mentalHealthScore = 100

    const lowerText = text.toLowerCase()

    // Check for vulgar words
    vulgarWords.forEach(word => {
      if (lowerText.includes(word)) {
        issues.push({
          type: 'vulgar',
          word,
          suggestion: getVulgarReplacement(word),
          severity: 'high'
        })
        score -= 25
        mentalHealthScore -= 30
      }
    })

    // Check for negative words
    negativeWords.forEach(word => {
      if (lowerText.includes(word)) {
        issues.push({
          type: 'negative',
          word,
          suggestion: getNegativeReplacement(word),
          severity: 'medium'
        })
        score -= 15
        mentalHealthScore -= 20
      }
    })

    // Check for aggressive language
    aggressiveWords.forEach(word => {
      if (lowerText.includes(word)) {
        issues.push({
          type: 'aggressive',
          word,
          suggestion: getAggressiveReplacement(word),
          severity: 'medium'
        })
        score -= 10
        mentalHealthScore -= 15
      }
    })

    // Check for dismissive language
    dismissiveWords.forEach(word => {
      if (lowerText.includes(word)) {
        issues.push({
          type: 'dismissive',
          word,
          suggestion: getDismissiveReplacement(word),
          severity: 'low'
        })
        score -= 5
        mentalHealthScore -= 10
      }
    })

    // Generate overall suggestions
    if (issues.length > 0) {
      suggestions.push('Consider using more supportive and collaborative language')
      if (issues.some(i => i.type === 'vulgar')) {
        suggestions.push('Replace inappropriate language with professional alternatives')
      }
      if (issues.some(i => i.type === 'aggressive')) {
        suggestions.push('Use gentler phrasing to encourage collaboration rather than demand compliance')
      }
      if (mentalHealthScore < 70) {
        suggestions.push('This message might create stress or anxiety. Consider a more supportive tone')
      }
    }

    return {
      score: Math.max(0, score),
      issues,
      suggestions,
      mentalHealthScore: Math.max(0, mentalHealthScore)
    }
  }

  const getVulgarReplacement = (word: string): string => {
    const replacements: Record<string, string> = {
      'fuck': 'challenging',
      'shit': 'difficult situation',
      'damn': 'unfortunate',
      'stupid': 'unclear',
      'dumb': 'confusing',
      'idiot': 'person',
      'moron': 'colleague',
      'retard': 'delay',
      'lame': 'not ideal',
      'suck': 'are challenging',
      'crap': 'low quality'
    }
    return replacements[word] || 'more appropriate term'
  }

  const getNegativeReplacement = (word: string): string => {
    const replacements: Record<string, string> = {
      'hate': 'find challenging',
      'terrible': 'needs improvement',
      'awful': 'concerning',
      'worst': 'most challenging',
      'horrible': 'difficult',
      'disgusting': 'unacceptable',
      'pathetic': 'needs attention',
      'useless': 'not effective',
      'worthless': 'needs improvement'
    }
    return replacements[word] || 'more constructive term'
  }

  const getAggressiveReplacement = (word: string): string => {
    const replacements: Record<string, string> = {
      'must': 'could',
      'should': 'might consider',
      'need to': 'would be helpful to',
      'have to': 'could',
      'demand': 'request',
      'require': 'would appreciate',
      'insist': 'suggest',
      'force': 'encourage'
    }
    return replacements[word] || 'gentler alternative'
  }

  const getDismissiveReplacement = (word: string): string => {
    const replacements: Record<string, string> = {
      'whatever': 'I understand',
      'obviously': 'as you may know',
      'clearly': 'it appears that',
      'just': '',
      'simply': '',
      'merely': '',
      'only': ''
    }
    return replacements[word] || 'more inclusive phrasing'
  }

  const applySuggestion = (originalWord: string, replacement: string) => {
    const newContent = content.replace(new RegExp(originalWord, 'gi'), replacement)
    onSuggestionApply(newContent)
  }

  const generateSupportiveVersion = () => {
    let improvedContent = content
    const analysis = analyzeMessage(content)
    
    analysis.issues.forEach(issue => {
      improvedContent = improvedContent.replace(
        new RegExp(issue.word, 'gi'), 
        issue.suggestion
      )
    })

    // Add supportive framing
    if (analysis.mentalHealthScore < 70) {
      improvedContent = `I hope you're doing well. ${improvedContent} Please let me know if you need any support with this.`
    }

    onSuggestionApply(improvedContent)
  }

  if (!content.trim()) return null

  const analysis = analyzeMessage(content)

  return (
    <div className="bg-gray-200 rounded-2xl p-4 shadow-neumorphism-inset space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-700 flex items-center space-x-2">
          <Lightbulb className="w-4 h-4" />
          <span>AI Communication Analysis</span>
        </h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Respectfulness</span>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              analysis.score >= 80 ? 'bg-green-100 text-green-700' :
              analysis.score >= 60 ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {analysis.score}%
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Heart className="w-4 h-4 text-pink-500" />
            <span className="text-xs text-gray-500">Mental Health</span>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              analysis.mentalHealthScore >= 80 ? 'bg-green-100 text-green-700' :
              analysis.mentalHealthScore >= 60 ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {analysis.mentalHealthScore}%
            </div>
          </div>
        </div>
      </div>

      {analysis.issues.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <AlertTriangle className="w-4 h-4 text-orange-500" />
            <span>Issues detected in your message:</span>
          </div>
          
          <div className="space-y-2">
            {analysis.issues.map((issue, index) => (
              <div key={index} className="bg-gray-200 rounded-xl p-3 shadow-neumorphism">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        issue.severity === 'high' ? 'bg-red-100 text-red-700' :
                        issue.severity === 'medium' ? 'bg-orange-100 text-orange-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {issue.type}
                      </span>
                      <span className="text-sm font-medium text-gray-700">"{issue.word}"</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Suggested replacement: <span className="font-medium text-gray-700">"{issue.suggestion}"</span>
                    </p>
                  </div>
                  <button
                    onClick={() => applySuggestion(issue.word, issue.suggestion)}
                    className="bg-gray-200 rounded-lg px-3 py-1 shadow-neumorphism hover:shadow-neumorphism-pressed transition-all duration-200 text-xs font-medium text-gray-700"
                  >
                    Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {analysis.suggestions.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 text-blue-500" />
            <span>Suggestions for improvement:</span>
          </div>
          <ul className="space-y-1">
            {analysis.suggestions.map((suggestion, index) => (
              <li key={index} className="text-xs text-gray-500 pl-4">
                • {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}

      {analysis.score < 80 && (
        <button
          onClick={generateSupportiveVersion}
          className="w-full bg-gray-200 rounded-xl py-2 shadow-neumorphism hover:shadow-neumorphism-pressed transition-all duration-200 text-sm font-medium text-gray-700 flex items-center justify-center space-x-2"
        >
          <Heart className="w-4 h-4 text-pink-500" />
          <span>Generate Supportive Version</span>
        </button>
      )}

      {analysis.score >= 80 && analysis.mentalHealthScore >= 80 && (
        <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 rounded-xl p-2">
          <CheckCircle className="w-4 h-4" />
          <span>Great! This message promotes respectful workplace communication.</span>
        </div>
      )}
    </div>
  )
}
