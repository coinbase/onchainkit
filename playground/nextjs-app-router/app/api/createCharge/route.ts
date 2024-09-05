import { ENVIRONMENT, ENVIRONMENT_VARIABLES } from '@/lib/constants';
import axios from 'axios';
import { NextResponse } from 'next/server';

type CommerceCharge = {
  data: {
    id: string;
  };
};

export async function POST() {
  // Generates a chargeId
  try {
    const response = await axios.post<CommerceCharge>(
      'https://api.commerce.coinbase.com/charges/',
      {
        name: 'Test Charge',
        description: 'Test Charge Description',
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
    return NextResponse.json({ id: response.data.data.id }, { status: 200 });
  } catch (error) {
    console.error(error);
  }
  return NextResponse.json({ status: 500 });
}
