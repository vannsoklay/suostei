"use client";

import { CardAudio, CardBlog, CardBook } from "./components/Card";

export default function Home() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-bold pb-4">Popular</h1>
        <div className="grid grid-cols-4 gap-4">
          <CardBlog href="1"/>
          <CardBlog href="2"/>
          <CardBlog href="3"/>
          <CardBlog href="4"/>
          <CardBlog href="5"/>
        </div>
      </section>
      <section>
        <h1 className="text-2xl font-bold pb-4">Top Books</h1>
        <div className="grid grid-cols-5 gap-4">
          <CardBook />
          <CardBook />
          <CardBook />
        </div>
      </section>
      <section>
        <h1 className="text-2xl font-bold pb-4">Top Audios</h1>
        <div className="grid grid-cols-3 gap-4">
          <CardAudio />
          <CardAudio />
          <CardAudio />
        </div>
      </section>
    </div>
  );
}
