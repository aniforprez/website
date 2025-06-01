import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    console.log();
    const data = await request.formData();
    const name = data.get("name");
    const email = data.get("email");
    const message = data.get("message");

    const honeypot = data.get("emai");
    if (honeypot) {
      console.log("honeypotted", request);
      return new Response(JSON.stringify({ success: true, error: "" }));
    }

    // Send an email to me
    console.log(name, email, message);
    return new Response(JSON.stringify({ success: true, error: "" }));
  } catch (error) {
    let message = "Unknown error";
    if (error instanceof Error) {
      message = error.message;
      console.error(error.message);
    }

    return new Response(JSON.stringify({ success: false, error: message }));
  }
};
