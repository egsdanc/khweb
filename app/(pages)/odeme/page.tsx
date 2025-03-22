"use client";

import { useSearchParams } from "next/navigation";
import Ode from "~/components/widgets/Ode";
import { Suspense } from "react";

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Content />
    </Suspense>
  );
};

const Content = () => {
  const searchParams = useSearchParams();
  const adet = searchParams.get("adet");
  const adetNumber = adet ? Number(adet) : undefined;

  return <Ode adet={adetNumber} />;
};

export default Page;
