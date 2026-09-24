// app/api/assessments/[...slug]/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://puspa-api.alfirdausina.com/api/v1";

/**
 * ===========================================================
 *                     HANDLER UNTUK GET
 * ===========================================================
 */
export async function GET(
  req: Request,
  { params }: { params: { slug: string[] } }
) {
  const { slug } = params;
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "paedagog";

  try {
    let endpoint = "";

    // CASE 1: GET /assessments/unanswered?type=paedagog
    if (slug.length === 1 && slug[0] !== "answer") {
      const status = slug[0];
      endpoint = `${BASE_URL}/assessments/${status}?type=${type}`;
    }

    // CASE 2: GET /assessments/{assessment_id}/answer?type=paedagog
    else if (slug.length === 2 && slug[1] === "answer") {
      const assessment_id = slug[0];
      endpoint = `${BASE_URL}/assessments/${assessment_id}/answer?type=${type}`;
    }

    // CASE 3: GET /assessments/{assessment_id}?type=paedagog
    else if (slug.length === 1) {
      const assessment_id = slug[0];
      endpoint = `${BASE_URL}/assessments/${assessment_id}?type=${type}`;
    }

    if (!endpoint) throw new Error("Invalid endpoint");

    // Axios GET request
    const { data } = await axios.get(endpoint);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("❌ Error GET assessments:", error.message);
    return NextResponse.json(
      {
        error: error.response?.data || "Failed to fetch data",
        status: error.response?.status || 500,
      },
      { status: error.response?.status || 500 }
    );
  }
}

/**
 * ===========================================================
 *                     HANDLER UNTUK POST
 * ===========================================================
 */
export async function POST(
  req: Request,
  { params }: { params: { slug: string[] } }
) {
  const { slug } = params;
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "paedagog";

  if (slug.length === 1) {
    const assessment_id = slug[0];
    const body = await req.json();

    try {
      const { data } = await axios.post(
        `${BASE_URL}/assessments/${assessment_id}?type=${type}`,
        body,
        { headers: { "Content-Type": "application/json" } }
      );

      return NextResponse.json(data);
    } catch (error: any) {
      console.error("❌ Error POST assessment:", error.message);
      return NextResponse.json(
        {
          error: error.response?.data || "Failed to submit assessment",
          status: error.response?.status || 500,
        },
        { status: error.response?.status || 500 }
      );
    }
  }

  return NextResponse.json({ error: "Invalid POST route" }, { status: 400 });
}
