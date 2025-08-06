import React from 'react'
import { AlertTriangle, CheckCircle, Lightbulb, Heart, Sparkles } from 'lucide-react'

interface AnalysisResult {
  score: number
  issues: Array<{
    type: 'vulgar' | 'negative' | 'aggressive' | 'dismissive' | 'questioning' | 'impatient'
    word: string
    suggestion: string
    severity: 'high' | 'medium' | 'low'
    context?: string
  }>
  suggestions: string[]
  mentalHealthScore: number
  positiveAlternatives: string[]
}

interface MessageAnalysisProps {
  content: string
  onSuggestionApply: (newContent: string) => void
}

export const MessageAnalysis: React.FC<MessageAnalysisProps> = ({ content, onSuggestionApply }) => {
  const analyzeMessage = (text: string): AnalysisResult => {
    const vulgarWords = ['fuck', 'shit', 'damn', 'stupid', 'dumb', 'idiot', 'moron', 'retard', 'lame', 'suck', 'crap']
    const negativeWords = ['hate', 'terrible', 'awful', 'worst', 'horrible', 'disgusting', 'pathetic', 'useless', 'worthless', 'disappointing', 'frustrated', 'annoying']
    const aggressiveWords = ['must', 'should', 'need to', 'have to', 'demand', 'require', 'insist', 'force', 'immediately', 'urgent', 'asap']
    const dismissiveWords = ['whatever', 'obviously', 'clearly', 'just', 'simply', 'merely', 'only']
    const questioningPatterns = [
      { pattern: /why are you/gi, replacement: 'I understand this might be' },
      { pattern: /why do you/gi, replacement: 'I wonder if you could help me understand' },
      { pattern: /why don't you/gi, replacement: 'would it be possible for you to' },
      { pattern: /why can't you/gi, replacement: 'I was hoping you might be able to' },
      { pattern: /why haven't you/gi, replacement: 'I wanted to check if you\'ve had a chance to' },
      { pattern: /why is this/gi, replacement: 'I\'m trying to understand why this might be' },
      { pattern: /why take/gi, replacement: 'I understand this might take' }
    ]
    const impatientWords = ['forever', 'taking too long', 'slow', 'delayed', 'behind schedule', 'overdue', 'late']

    const issues: AnalysisResult['issues'] = []
    const suggestions: string[] = []
    const positiveAlternatives: string[] = []
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
          severity: 'high',
          context: 'This word may be offensive in professional settings'
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
          severity: 'medium',
          context: 'Consider a more constructive approach'
        })
        score -= 15
        mentalHealthScore -= 20
      }
    })

    // Check for aggressive questioning patterns
    questioningPatterns.forEach(({ pattern, replacement }) => {
      const matches = text.match(pattern)
      if (matches) {
        matches.forEach(match => {
          issues.push({
            type: 'questioning',
            word: match,
            suggestion: replacement,
            severity: 'high',
            context: 'Aggressive questioning can create defensiveness and stress'
          })
          score -= 20
          mentalHealthScore -= 25
        })
      }
    })

    // Check for impatient language
    impatientWords.forEach(word => {
      if (lowerText.includes(word)) {
        issues.push({
          type: 'impatient',
          word,
          suggestion: getImpatientReplacement(word),
          severity: 'medium',
          context: 'This may create pressure and anxiety'
        })
        score -= 12
        mentalHealthScore -= 18
      }
    })

    // Check for aggressive language
    aggressiveWords.forEach(word => {
      if (lowerText.includes(word)) {
        issues.push({
          type: 'aggressive',
          word,
          suggestion: getAggressiveReplacement(word),
          severity: 'medium',
          context: 'Try a more collaborative approach'
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
          severity: 'low',
          context: 'This might sound dismissive'
        })
        score -= 5
        mentalHealthScore -= 10
      }
    })

    // Generate helpful suggestions
    if (issues.length > 0) {
      if (issues.some(i => i.type === 'questioning')) {
        suggestions.push('Transform questions into supportive statements that show understanding')
        positiveAlternatives.push('Instead of asking "why", try expressing your needs clearly and offering support')
      }
      if (issues.some(i => i.type === 'impatient')) {
        suggestions.push('Acknowledge that good work takes time and offer assistance if needed')
        positiveAlternatives.push('Express appreciation for their effort and ask how you can help')
      }
      if (issues.some(i => i.type === 'vulgar' || i.type === 'negative')) {
        suggestions.push('Use neutral, professional language that focuses on solutions')
        positiveAlternatives.push('Frame challenges as opportunities for improvement')
      }
      if (issues.some(i => i.type === 'aggressive')) {
        suggestions.push('Replace demands with collaborative requests and explanations')
        positiveAlternatives.push('Explain the reasoning behind requests to build understanding')
      }
      if (mentalHealthScore < 70) {
        suggestions.push('Consider how this message might affect the recipient\'s wellbeing')
        positiveAlternatives.push('Add supportive language that shows you care about their success')
      }
    } else if (score >= 80) {
      positiveAlternatives.push('Your message has a supportive and professional tone!')
    }

    return {
      score: Math.max(0, score),
      issues,
      suggestions,
      mentalHealthScore: Math.max(0, mentalHealthScore),
      positiveAlternatives
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
      'crap': 'needs improvement'
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
      'worthless': 'needs improvement',
      'disappointing': 'not meeting expectations',
      'frustrated': 'finding this challenging',
      'annoying': 'inconvenient'
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
      'force': 'encourage',
      'immediately': 'when convenient',
      'urgent': 'important',
      'asap': 'at your earliest convenience'
    }
    return replacements[word] || 'gentler alternative'
  }

  const getImpatientReplacement = (word: string): string => {
    const replacements: Record<string, string> = {
      'forever': 'some time',
      'taking too long': 'taking the time needed',
      'slow': 'thorough',
      'delayed': 'in progress',
      'behind schedule': 'working on the timeline',
      'overdue': 'still pending',
      'late': 'coming along'
    }
    return replacements[word] || 'more patient phrasing'
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
    const regex = new RegExp(originalWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
    const newContent = content.replace(regex, replacement)
    onSuggestionApply(newContent)
  }

  const generateSupportiveVersion = () => {
    let improvedContent = content
    const analysis = analyzeMessage(content)
    
    // Apply all improvements
    analysis.issues.forEach(issue => {
      if (issue.type === 'questioning') {
        // Handle questioning patterns specially
        const regex = new RegExp(issue.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
        improvedContent = improvedContent.replace(regex, issue.suggestion)
      } else {
        const regex = new RegExp(issue.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
        improvedContent = improvedContent.replace(regex, issue.suggestion)
      }
    })

    // Add supportive framing based on content
    if (analysis.mentalHealthScore < 70) {
      improvedContent = `I hope you're doing well. ${improvedContent} Please let me know if you need any support or if there's anything I can do to help.`
    } else if (analysis.score < 80) {
      improvedContent = `${improvedContent} Thank you for your understanding.`
    }

    onSuggestionApply(improvedContent)
  }

  if (!content.trim()) {
    return (
      <div className="bg-gray-200 rounded-2xl p-4 shadow-neumorphism-inset">
        <div className="text-center py-8">
          <Lightbulb className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">Start typing your message to get AI-powered communication suggestions</p>
        </div>
      </div>
    )
  }

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
            <span>Suggestions to make your message more supportive:</span>
          </div>
          
          <div className="space-y-2">
            {analysis.issues.map((issue, index) => (
              <div key={index} className="bg-gray-200 rounded-xl p-3 shadow-neumorphism">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        issue.severity === 'high' ? 'bg-red-100 text-red-700' :
                        issue.severity === 'medium' ? 'bg-orange-100 text-orange-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {issue.type === 'questioning' ? 'harsh questioning' : issue.type}
                      </span>
                      <span className="text-sm font-medium text-gray-700">"{issue.word}"</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">
                      Try: <span className="font-medium text-gray-700">"{issue.suggestion}"</span>
                    </p>
                    {issue.context && (
                      <p className="text-xs text-gray-400 italic">{issue.context}</p>
                    )}
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
            <span>Communication tips:</span>
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

      {analysis.positiveAlternatives.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span>Positive approach:</span>
          </div>
          <ul className="space-y-1">
            {analysis.positiveAlternatives.map((alternative, index) => (
              <li key={index} className="text-xs text-gray-500 pl-4">
                • {alternative}
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
          <span>Excellent! This message promotes respectful workplace communication.</span>
        </div>
      )}
    </div>
  )
}
