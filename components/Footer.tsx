"use client";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { notificationSchema } from "@/lib/validations";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import Image from "next/image";

const socialLinks = [
  {
    href: "https://facebook.com",
    src: "/icons/socials-icons/icon-1.svg",
    label: "Facebook",
  },
  {
    href: "https://instagram.com",
    src: "/icons/socials-icons/icon-2.svg",
    label: "Instagram",
  },
  {
    href: "https://linkedin.com",
    src: "/icons/socials-icons/icon-3.svg",
    label: "LinkedIn",
  },
  {
    href: "https://whatsapp.com",
    src: "/icons/socials-icons/icon-4.svg",
    label: "WhatsApp",
  },
  {
    href: "https://telegram.org",
    src: "/icons/socials-icons/icon-5.svg",
    label: "Telegram",
  },
  {
    href: "https://apple.com",
    src: "/icons/socials-icons/icon-6.svg",
    label: "Apple",
  },
];

const paymentIcons = [
  { src: "/icons/payment-icons/icon-1.svg", alt: "Visa" },
  { src: "/icons/payment-icons/icon-2.svg", alt: "Mastercard" },
  { src: "/icons/payment-icons/icon-3.svg", alt: "Apple Pay" },
  { src: "/icons/payment-icons/icon-4.svg", alt: "Google Pay" },
  { src: "/icons/payment-icons/icon-5.svg", alt: "PayPal" },
];

export default function Footer() {
  const form = useForm<z.infer<typeof notificationSchema>>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      email: "",
      terms: false,
    },
  });

  function onSubmit(values: z.infer<typeof notificationSchema>) {
    console.log(values);
  }

  return (
    <footer>
      <div className="w-full">
        <div className="grid items-center gap-8 px-10 xl:px-[10%] py-8 md:py-14 lg:grid-cols-[auto_auto] lg:justify-between">
          <div className="space-y-6">
            <p className="text-base text-primary max-w-md xl:max-w-lg">
              At Go English School, we're passionate about helping you succeed.
              Whether you're a beginner or brushing up for advanced
              conversations, we have the tools and expertise to help you thrive.
              Don't wait—your journey to unlocking your superpower starts today.
            </p>
            <nav className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-4 text-left max-w-sm">
              <div className="space-y-4">
                <Link href="/contact" className="link-text block">
                  Contact Us
                </Link>
                <Link href="/faq" className="link-text block">
                  Work with Go English
                </Link>
              </div>
              <div className="space-y-4">
                <Link href="/work-with-us" className="link-text block">
                  FAQ
                </Link>
                <Link href="/help" className="link-text block">
                  Help
                </Link>
              </div>
            </nav>
          </div>
          <div className="space-y-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 w-full"
                noValidate
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative max-w-sm xl:max-w-md">
                          <Input
                            placeholder="Your email"
                            {...field}
                            className="text-primary text-base rounded-2xl shadow-sm bg-light-400 border-none px-5 py-4 placeholder:text-primary placeholder-text-base focus-visible:ring-light-400 w-max-sm"
                          />
                          <Button
                            type="submit"
                            className="absolute right-0 top-0 h-full bg-primary font-normal text-light-100 rounded-full text-lg px-8"
                          >
                            Subscribe
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="h-4 w-4 rounded-none bg-gray-400 data-[state=checked]:bg-gray-400 border-none translate-y-[1px]"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-normal max-w-md xl:max-w-xl">
                        <Label
                          htmlFor="terms"
                          className="text-sm text-primary peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Personal details will be held by the Go English and
                          will only be used in relation to your request. Please
                          read our{" "}
                          <Link href="/terms" className="link-text">
                            terms of use
                          </Link>{" "}
                          for more information.
                        </Label>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
            <div className="flex gap-4">
              {socialLinks.map(({ href, src, label }) => (
                <Link key={href} href={href} className="link-text">
                  <Image src={src} alt={label} width={32  } height={32} />
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="flex w-full h-[80px] px-20 gap-3 justify-end bg-primary items-center">
          {paymentIcons.map(({ src, alt }) => (
            <Image
              key={src}
              src={src}
              alt={alt}
              width={58}
              height={42}
              className="text-light-100"
            />
          ))}
        </div>
      </div>
    </footer>
  );
}
