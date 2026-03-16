import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const VALID_INDUSTRIES = [
  "Search & Cloud",
  "Social Media",
  "AI / ML",
  "E-Commerce & Cloud",
  "Retail",
  "Enterprise Software",
  "Hardware & IT",
  "Consumer Electronics",
  "Entertainment",
  "Mobility",
  "Fintech",
  "Creative Software",
  "Automotive & Energy",
  "Travel & Hospitality",
  "Data & Analytics",
  "Networking & Security",
  "SaaS & IT Service Management",
  "Other",
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { company } = await req.json();
    if (!company || typeof company !== "string") {
      return new Response(
        JSON.stringify({ error: "company is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          {
            role: "system",
            content: `You are an industry classifier. Given a company name, return its industry category. You MUST pick exactly one from this list: ${VALID_INDUSTRIES.join(", ")}. Return ONLY the category name, nothing else.`,
          },
          { role: "user", content: company },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "classify_industry",
              description: "Classify a company into an industry category",
              parameters: {
                type: "object",
                properties: {
                  industry: {
                    type: "string",
                    enum: VALID_INDUSTRIES,
                    description: "The industry category",
                  },
                },
                required: ["industry"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "classify_industry" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ industry: "Other" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    let industry = "Other";

    if (toolCall?.function?.arguments) {
      try {
        const args = JSON.parse(toolCall.function.arguments);
        if (VALID_INDUSTRIES.includes(args.industry)) {
          industry = args.industry;
        }
      } catch {
        console.error("Failed to parse tool call arguments");
      }
    }

    return new Response(JSON.stringify({ industry }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("categorize-company error:", e);
    return new Response(
      JSON.stringify({ industry: "Other" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
