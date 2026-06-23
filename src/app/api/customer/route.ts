import { NextResponse } from 'next/server';
import { retrieveCustomer } from '@lib/data/customer';

export async function GET() 
{
  try {
    const customer = await retrieveCustomer();
    if (customer) 
    {
      return NextResponse.json({ customer });
    } else 
    {
      return NextResponse.json({ customer: null }, { status: 404 });
    }
  } catch (error) 
  {
    console.error('Error in /api/customer:', error);
    return NextResponse.json({ error: 'Failed to retrieve customer' }, { status: 500 });
  }
}