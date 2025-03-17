import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';

export const maxDuration = 30;

interface MealPlanPreferences {
  numberOfWeeks: number;
  dietaryRestrictions: string;
  mealPlanType: string;
  dailyMealCount: number;
  maxCookingTime: number;
  minCalories: number;
  maxCalories: number;
  nutrientDensity: number;
  additionalPreferences: string;
  includeIngredients: string;
  excludeIngredients: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: MealPlanPreferences = await request.json();
    
    const prompt = `
    Generate a detailed weekly meal plan that meets the following criteria:
    
    Number of Weeks: ${data.numberOfWeeks}
    Dietary Restrictions: ${data.dietaryRestrictions}
    Meal Plan Type: ${data.mealPlanType}
    Daily Meal Count: ${data.dailyMealCount}
    Maximum Cooking Time per Meal: ${data.maxCookingTime} minutes
    Calorie Range per Meal: ${data.minCalories} - ${data.maxCalories} calories
    Nutrient Density Target: ${data.nutrientDensity}%
    Additional Preferences: ${data.additionalPreferences}
    Must Include Ingredients: ${data.includeIngredients}
    Must Exclude Ingredients: ${data.excludeIngredients}
    
    Please provide a weekly meal plan with:
    1. An overview for each week
    2. A daily meal breakdown with recipe names and brief descriptions
    3. Detailed recipes for each meal including ingredients, step-by-step instructions, and nutritional information
    4. Preparation tips and shopping list suggestions

    Also add relevant Emoji's.
    `;

    console.log(prompt);
    const { text } = await generateText({
      // model: openai('gpt-4o-mini'),
      model: google("gemini-2.0-flash-001"),
      system: 'You are a professional meal plan generator. Create detailed, easy-to-follow weekly meal plans that match the given criteria. Include all nutritional information, preparation tips, and shopping list suggestions. Your response will be in Markdown format, including relevant emojis. Directly start with the meal plan in your response in Markdown format, without any introductory sentences. It must be well-formatted.',
      prompt: prompt,
    });

    return NextResponse.json({ 
      message: 'Meal plan generated successfully', 
      mealPlan: text 
    });
  } catch (error) {
    console.error('Error generating meal plan:', error);
    return NextResponse.json(
      { error: 'Failed to generate meal plan' }, 
      { status: 500 }
    );
  }
}
