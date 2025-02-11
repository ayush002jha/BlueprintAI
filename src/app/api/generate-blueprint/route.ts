import { NextRequest, NextResponse } from 'next/server';
import { context} from './data';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';


export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { age, diet, sleep, goals } = data;
    // Combine the details into a single string
    const userDetails = `Age: ${age}, Diet: ${diet}, Average Sleep: ${sleep} hours, Health Goals: ${goals}`;

    // console.log(userDetails)  
    
    const prompt = `
    You are a Don't Die Blueprint Generator. 
    Use the following context to answer the question.
    Your Job is to create the customized don't die blueprint for the given details.

    CUSTOM USER DETAIL:
    ${userDetails}

    ---------
    CONTEXT:
    Protocol:
    ${context.protocol}
    ---
    Bryan Johnson Daily Routine:
    ${context.dailyRoutine}
    ---
    These are the following Details that Bryan Johnson Blueprint includes:
    EAT:
    ${context.eat}
    ---
    Sleep:
    ${context.sleep}
    ---
    Exercise:
    ${context.exercise}
    ---
    Females:
    ${context.females}
    ---
    Pregnant:
    ${context.pregnant}
    ---
    BadHabits:
    ${context.badHabits}
    `

    // console.log(prompt)



    const { text } = await generateText({
        model: openai('gpt-4o-mini'),
        system:
          'You are a professional Dont Die Blueprint Generator. ' +
          'You write simple, clear, and concise content. Your response will be in Markdown Format. Add Relevant Emojis. It must be well formatted with heading, points and subpoints.',
        prompt: prompt,
      });

      console.log(text)

    return NextResponse.json({ message: 'Blueprint generated successfully', details: text });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Failed to generate blueprint' }, { status: 500 });
  }
}

