import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import createServerSupabase from "utils/supabase.server";
import Login from "components/login";
import RealtimeMessages from "components/realtime-messages";

export const action = async ({ request }: ActionFunctionArgs) => {
  const response = new Response();
  const supabase = createServerSupabase({ request, response });

  const { message } = Object.fromEntries(await request.formData());
  const { error } = await supabase
    .from("messages")
    .insert({ content: String(message) });

  if (error) {
    console.error(error);
  }

  return json(null, { headers: response.headers });
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const response = new Response();
  const supabase = createServerSupabase({ request, response });
  const { data } = await supabase.from("messages").select("*");
  return json({ messages: data ?? [] }, { headers: response.headers });
};

export default function Index() {
  const { messages } = useLoaderData<typeof loader>();
  return (
    <>
      <Login />
      <RealtimeMessages serverMessages={messages} />
      <Form method="post">
        <input type="text" name="message" />
        <button type="submit">Send</button>
      </Form>
    </>
  );
}
