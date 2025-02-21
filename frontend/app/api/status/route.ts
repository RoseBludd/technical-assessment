import { fetchStatus } from "@/api/mock-data";

export async function GET() {
  try {
    const status = await fetchStatus();

    return new Response(JSON.stringify(status), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch status" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
