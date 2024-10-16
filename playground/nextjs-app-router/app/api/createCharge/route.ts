import { ENVIRONMENT, ENVIRONMENT_VARIABLES } from '@/lib/constants';
import axios from 'axios';
import { NextResponse } from 'next/server';

type CommerceCharge = {
  data: {
    id: string;
  };
};

export async function POST(req: Request) {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-CC-Api-Key',
      },
    });
  }

  // Generates a chargeId
  const { name, description } = await req.json();
  try {
    const response = await axios.post<CommerceCharge>(
      'https://api.commerce.coinbase.com/charges/',
      {
        name,
        description,
        pricing_type: 'fixed_price',
        local_price: {
          amount: '0.01',
          currency: 'USD',
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-CC-Api-Key': ENVIRONMENT_VARIABLES[ENVIRONMENT.COMMERCE_API_KEY],
        },
      },
    );

    return new NextResponse(JSON.stringify({ id: response.data.data.id }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      },
    );
  }
}
