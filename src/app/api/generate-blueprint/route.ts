import { NextRequest, NextResponse } from "next/server";
import { context } from "./data";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";

export const maxDuration = 30; // Sets the function timeout to 30 seconds

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { age, gender, weight, diet, sleep, goals } = data;

    // Combine the details into a single string, now including gender and weight
    const userDetails = `Age: ${age}, Gender: ${gender}, Weight: ${weight}kg, Diet: ${diet}, Average Sleep: ${sleep} hours, Health Goals: ${goals}`;

    // Calculate BMI for additional context (optional but useful)
    const heightInMeters = 1.7; // You might want to add height as another field in the future
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);

    const prompt = `
    You are a Don't Die Blueprint Generator. 
    Use the following context to generate a personalized health blueprint.
    Your Job is to create the customized don't die blueprint for the given details.

    CUSTOM USER DETAIL:
    ${userDetails}
    Calculated BMI: ${bmi} (For reference only)

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
    ${
      gender === "female"
        ? `Female-Specific Considerations:
    ${context.females}
    ---`
        : ""
    }
    ${
      gender === "female"
        ? `Pregnancy Considerations (if applicable):
    ${context.pregnant}
    ---`
        : ""
    }
    BadHabits:
    ${context.badHabits}
    
    Important Notes:
    1. Consider the user's gender (${gender}) when providing recommendations
    2. Adjust recommendations based on their current weight (${weight}kg) and BMI (${bmi})
    3. Tailor the exercise and nutrition advice to their specific goals: ${goals}
    4. Account for their current diet type: ${diet}
    5. Consider their age (${age}) when making recommendations
    `;

    const { text } = await generateText({
      // model: openai('gpt-4o-mini'),
      model: google("gemini-2.0-flash-001"),
      system:
        "You are a professional 'Don't Die' Blueprint Generator. You create specific, simple, clear, and concise content. Your response will be in Markdown format, including relevant emojis. It must be well-formatted. Include the user's metric details for whom you are creating the Blueprint. The title should be relevant to these details. Directly start with the Blueprint in your response in Markdown format, without any introductory sentences. Ensure recommendations are gender-appropriate and consider the user's specific metrics (age, weight, BMI) and goals.",
      prompt: prompt,
    });

    console.log(text);

    return NextResponse.json({
      message: "Blueprint generated successfully",
      details: text,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Failed to generate blueprint" },
      { status: 500 }
    );
  }
}
