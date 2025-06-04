import type { APIRoute } from "astro";
import { ActionError } from "astro:actions";
import { Resend } from "resend";
import { z } from "zod";

export const prerender = false;

const rateLimit = new Map();
// Rate limit window in ms
const windowMs = 24 * 60 * 60 * 1000;
const limit = 1;

const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = Object.fromEntries(await request.formData());

    const schema = z.object({
      name: z.string().min(3).max(100),
      email: z.string().email().max(50),
      message: z.string().min(10).max(1000),
    });

    const honeypot = data["emai-confirm"];
    if (honeypot) {
      console.info("Honeypotted", request);
      return new Response(JSON.stringify({ success: true, error: "" }));
    }

    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ success: true, error: parsed.error.message }),
      );
    }

    // Rate limit if email gets sent
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const userLimit = rateLimit.get(ip) || {
      count: 0,
      resetTime: now + windowMs,
    };
    if (now > userLimit.resetTime) {
      userLimit.count = 1;
      userLimit.resetTime = now + windowMs;
    } else {
      userLimit.count++;
    }

    // Send an email to me if not rate limited
    if (userLimit.count <= limit) {
      const resend = new Resend(RESEND_API_KEY);

      const { error } = await resend.emails.send({
        from: "Finesse <dev@finesse.money>",
        to: ["ani.22691@gmail.com"],
        subject: parsed.data.name,
        html: `From ${parsed.data.email}\n\n${parsed.data.message}`,
      });

      if (error) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: error.message,
        });
      }
    } else {
      console.info("Rate limited: ", ip);
    }

    rateLimit.set(ip, userLimit);

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
