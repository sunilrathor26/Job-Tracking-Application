import Image from "next/image";
import Logo from "../assets/logo.svg";
import LandingImg from "../assets/main.svg";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function Home() {
  return (
    <main>
      <header className="max-w-6xl mx-auto px-4 sm:px-8 py-6 ">
        <Image src={Logo} alt="logo" />
      </header>
      <section className="max-w-6xl mx-auto px-4 sm:px-8 h-screen grid lg:grid-cols-2 items-center">
        <div>
          <h1 className="capitalize text-4xl md:text-6xl lg:text-6xl max-w-full font-bold">
            job <span className="text-primary">tracking</span> app
          </h1>
          <p className="leading-loose max-w-md mt-4">
            Jobify is a job application tracking system for job hunters. It
            helps you keep track of your job applications, interviews, and
            follow-ups. You can also set reminders for follow-ups and
            interviews. It is a simple and easy to use app that helps you stay
            organized and focused on your job search.
          </p>
          <Button asChild className="mt-4">
            <Link href="/add-job">Get Started</Link>
          </Button>
        </div>
        <div className="flex justify-end">
          <Image
            src={LandingImg}
            alt="landing"
            className="hidden lg:block object-contain"
            width={400}
            height={400}
          />
        </div>
      </section>
    </main>
  );
}
