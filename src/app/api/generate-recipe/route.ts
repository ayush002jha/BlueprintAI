import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';

export const maxDuration = 30;

interface RecipePreferences {
  dietaryRestrictions: string;
  mealType: string;
  cookingTime: number;
  minCalories: number;
  maxCalories: number;
  nutrientDensity: number;
  additionalPreferences: string;
  includeIngredients: string;
  excludeIngredients: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: RecipePreferences = await request.json();
    
    const prompt = `
    Generate a detailed recipe that meets the following criteria:
    
    Dietary Restrictions: ${data.dietaryRestrictions}
    Meal Type: ${data.mealType}
    Maximum Cooking Time: ${data.cookingTime} minutes
    Calorie Range: ${data.minCalories} - ${data.maxCalories} calories
    Nutrient Density Target: ${data.nutrientDensity}%
    Additional Preferences: ${data.additionalPreferences}
    Must Include Ingredients: ${data.includeIngredients}
    Must Exclude Ingredients: ${data.excludeIngredients}
    
    Please provide a recipe with:
    1. Recipe name
    2. Preparation time and cooking time
    3. Ingredients list with measurements
    4. Step-by-step cooking instructions
    5. Nutritional information
    6. Tips for preparation

    Also add relevant Emoji's.
    `;

    console.log(prompt)
    const { text } = await generateText({
      // model: openai('gpt-4o-mini'),
      model: google("gemini-2.0-flash-001"),
      system: 'You are a professional recipe generator. Create detailed, easy-to-follow recipes that match the given criteria. Include all nutritional information and preparation tips. Your response will be in Markdown format, including relevant emojis. Directly start with the Recipie in your response in Markdown format, without any introductory sentences. It must be well-formatted.',
      prompt: prompt,
    });

    return NextResponse.json({ 
      message: 'Recipe generated successfully', 
      recipe: text 
    });
  } catch (error) {
    console.error('Error generating recipe:', error);
    return NextResponse.json(
      { error: 'Failed to generate recipe' }, 
      { status: 500 }
    );
  }
}