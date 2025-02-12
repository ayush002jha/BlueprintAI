'use server'

import { revalidatePath } from 'next/cache';

export async function generateRecipe(preferences: any) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/generate-recipe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences),
    });

    if (!response.ok) {
      throw new Error('Failed to generate recipe');
    }

    const data = await response.json();
    revalidatePath('/recipe');
    return data.recipe;
  } catch (error) {
    console.error('Error in generateRecipe:', error);
    throw error;
  }
}