import { Link } from "react-router";
import type { Route } from "../+types/root";
import { Button } from "~/components/ui/button";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ECC Chat App" },
    { name: "ECC Chat App", content: "A secure messaging application" },
  ];
}

export default function Home() {
  return (
    <div>
      <p>This page is for Landing Page. TBA</p>
      <Link to={"/chat"}><Button>Go to Chat</Button></Link>
    </div>
  );
}
