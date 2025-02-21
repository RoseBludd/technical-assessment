import { fetchMetrics } from "@/api/mock-data";

export async function GET() {
  try {
    const metrics = await fetchMetrics();

    return new Response(JSON.stringify(metrics), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch metrics" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
