const OpenAI = require('openai');
const logger = require('../utils/logger');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Generate interview questions based on resume skills and domain
exports.generateInterviewQuestions = async ({ domain, jobRole, difficulty, skills, count = 8 }) => {
  try {
    const prompt = `You are an expert technical interviewer. Generate ${count} interview questions for the following:
    - Job Role: ${jobRole}
    - Domain/Technology: ${domain}
    - Difficulty Level: ${difficulty}
    - Candidate Skills: ${skills.join(', ')}
    
    Return ONLY a valid JSON array of questions with this structure:
    [
      {
        "questionText": "question here",
        "category": "technical|behavioral|situational",
        "difficulty": "easy|medium|hard",
        "expectedAnswer": "brief expected answer",
        "followUpQuestions": ["follow up 1", "follow up 2"]
      }
    ]
    
    Mix technical, behavioral and situational questions. Make them progressively harder.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const content = JSON.parse(response.choices[0].message.content);
    return content.questions || content;
  } catch (error) {
    logger.error('AI question generation error:', error);
    throw new Error('Failed to generate questions');
  }
};

// Analyze a candidate's answer
exports.analyzeAnswer = async ({ questionText, answerText, expectedAnswer, domain }) => {
  try {
    const prompt = `You are an expert interviewer evaluating a candidate's answer. 
    
    Question: ${questionText}
    Expected Answer Criteria: ${expectedAnswer}
    Candidate's Answer: ${answerText}
    Domain: ${domain}
    
    Evaluate and return ONLY valid JSON:
    {
      "score": <0-10>,
      "confidence": <0-100>,
      "clarity": <0-100>,
      "technicalAccuracy": <0-100>,
      "grammarScore": <0-100>,
      "keywordsMatched": ["keyword1", "keyword2"],
      "feedback": "detailed personalized feedback",
      "strengths": ["strength1"],
      "improvements": ["improvement1"]
    }`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    logger.error('AI answer analysis error:', error);
    return { score: 5, confidence: 50, clarity: 50, technicalAccuracy: 50, grammarScore: 50, keywordsMatched: [], feedback: 'Unable to analyze at this time.' };
  }
};

// Extract skills from resume text
exports.extractSkillsFromResume = async (resumeText) => {
  try {
    const prompt = `Extract all technical skills, programming languages, frameworks, tools, and soft skills from this resume.
    Resume: ${resumeText.substring(0, 3000)}
    
    Return ONLY valid JSON:
    {
      "technicalSkills": ["skill1", "skill2"],
      "softSkills": ["skill1"],
      "experience": "X years",
      "seniorityLevel": "junior|mid|senior",
      "topDomains": ["domain1", "domain2"],
      "atsScore": <0-100>,
      "weakAreas": ["area1"],
      "summary": "brief professional summary"
    }`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      response_format: { type: 'json_object' },
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    logger.error('Resume analysis error:', error);
    throw new Error('Failed to analyze resume');
  }
};

// Generate overall interview feedback
exports.generateOverallFeedback = async ({ domain, jobRole, answers, totalScore }) => {
  try {
    const answersummary = answers.map(a => `Q: ${a.questionText}\nA: ${a.answerText}\nScore: ${a.score}/10`).join('\n\n');
    
    const prompt = `As an expert interviewer, provide comprehensive feedback for a ${jobRole} interview in ${domain}.
    
    Overall Score: ${totalScore}%
    Interview Answers Summary:
    ${answersummary.substring(0, 2000)}
    
    Return ONLY valid JSON:
    {
      "overallFeedback": "comprehensive feedback paragraph",
      "strengths": ["strength1", "strength2", "strength3"],
      "improvements": ["improvement1", "improvement2", "improvement3"],
      "recommendation": "hire|consider|reject",
      "nextSteps": ["step1", "step2"],
      "estimatedReadiness": "X months to be job-ready"
    }`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4,
      response_format: { type: 'json_object' },
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    logger.error('Overall feedback error:', error);
    throw new Error('Failed to generate feedback');
  }
};

// Generate coding problem
exports.generateCodingProblem = async ({ domain, difficulty, skills }) => {
  try {
    const prompt = `Generate a coding interview problem for:
    Domain: ${domain}
    Difficulty: ${difficulty}
    Skills: ${skills.join(', ')}
    
    Return ONLY valid JSON:
    {
      "title": "Problem Title",
      "description": "detailed problem description",
      "difficulty": "${difficulty}",
      "examples": [{"input": "example input", "output": "expected output", "explanation": "why"}],
      "constraints": ["constraint1", "constraint2"],
      "tags": ["tag1", "tag2"],
      "hints": ["hint1"],
      "solution": "optimal solution approach"
    }`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
      response_format: { type: 'json_object' },
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    logger.error('Coding problem generation error:', error);
    throw new Error('Failed to generate coding problem');
  }
};

// Review submitted code
exports.reviewCode = async ({ code, language, problem, testResults }) => {
  try {
    const prompt = `Review this ${language} code submission for the coding problem.
    
    Problem: ${problem.title} - ${problem.description}
    Submitted Code: ${code}
    Test Results: ${JSON.stringify(testResults)}
    
    Return ONLY valid JSON:
    {
      "quality": <0-100>,
      "efficiency": <0-100>,
      "readability": <0-100>,
      "timeComplexity": "O(n)",
      "spaceComplexity": "O(1)",
      "feedback": "detailed feedback",
      "suggestions": ["suggestion1", "suggestion2"],
      "bugs": ["bug1"],
      "positives": ["positive1"]
    }`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    logger.error('Code review error:', error);
    return { quality: 50, efficiency: 50, readability: 50, feedback: 'Code review unavailable', suggestions: [] };
  }
};
