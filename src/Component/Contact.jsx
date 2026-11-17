import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageCircle,
  ArrowUpRight,
} from "lucide-react";
import { href } from "react-router-dom";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const subject = encodeURIComponent(formData.subject.trim());
    const body = encodeURIComponent(
      `Name: ${formData.name.trim()}\nEmail: ${formData.email.trim()}\n\n${formData.message.trim()}`,
    );

    window.location.href = `mailto:support@visitorhub.com?subject=${subject}&body=${body}`;
  }

  const contactInfo = [
    {
      icon: <Mail size={22} />,
      title: "Email Us",
      detail: "support@visitorhub.com",
      href: "mailto:support@visitorhub.com",
    },
    {
      icon: <Phone size={22} />,
      title: "Call Us",
      detail: "+91 XXXXX XXXXX",
    },
    {
      icon: <MapPin size={22} />,
      title: "Our Location",
      detail: "Ahmedabad, Gujarat, India",
      href: "https://www.google.com/maps/search/?api=1&query=Privilon%2C%20312%2C%20Sarkhej%20-%20Gandhinagar%20Highway%2C%20Vikram%20Nagar%2C%20Ahmedabad%2C%20Gujarat%20380058",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f4f6ef] pt-16 text-gray-800">
      {/* Hero Section */}
      <section className="bg-[#173d32] px-4 py-12 text-center text-white sm:px-6 sm:py-16 lg:py-20">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-green-300 sm:text-sm sm:tracking-[3px]">
          Contact Us
        </p>

        <h1 className="mx-auto max-w-4xl text-balance text-[clamp(2rem,6vw,3.25rem)] font-bold leading-tight">
          We'd Love to Hear From You
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-gray-200 sm:mt-5 sm:text-base sm:leading-7">
          Have a question about visitor registration, events, or digital passes?
          Send us a message and let us know how we can help.
        </p>
      </section>

      {/* Contact Section */}
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:gap-10 sm:px-6 sm:py-14 lg:grid-cols-5 lg:gap-12 lg:px-8 lg:py-16">
        {/* Contact Information */}
        <div className="min-w-0 lg:col-span-2">
          <h2 className="text-2xl font-bold sm:text-3xl">Get in Touch</h2>

          <p className="mt-3 text-sm leading-7 text-gray-600 sm:mt-4 sm:text-base">
            Our team is here to help with your questions and feedback. Reach out
            using the details below or send us a message.
          </p>

          <div className="mt-6 grid gap-4 sm:mt-8 sm:gap-5">
            {contactInfo.map((item) => {
              const content = (
                <>
                  <div className="shrink-0 rounded-lg bg-green-100 p-3 text-[#173d32]">
                    {item.icon}
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-bold">{item.title}</h3>
                    <p className="mt-1 wrap-break-word text-sm text-gray-600">
                      {item.detail}
                    </p>
                  </div>
                </>
              );
              const className =
                "flex min-w-0 items-start gap-3 rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md sm:gap-4 sm:p-5";

              return item.href ? (
                <a
                  key={item.title}
                  href={item.href}
                  target={
                    item.href.startsWith("https://") ? "_blank" : undefined
                  }
                  rel={
                    item.href.startsWith("https://")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className={`${className} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285b49]`}
                >
                  {content}
                </a>
              ) : (
                <div key={item.title} className={className}>
                  {content}
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Form */}
        <div className="min-w-0 rounded-2xl bg-white p-5 shadow-lg sm:p-8 lg:col-span-3">
          <div className="mb-6 sm:mb-7">
            <div className="inline-flex rounded-xl bg-green-100 p-3 text-[#173d32]">
              <MessageCircle size={26} />
            </div>

            <h2 className="mt-4 text-xl font-bold sm:text-2xl">
              Send Us a Message
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Fill in the details below. Your default email app will open with
              your message ready to send.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-4 sm:gap-5 md:grid-cols-2"
          >
            <div className="min-w-0">
              <label
                htmlFor="contact-name"
                className="mb-2 block text-sm font-semibold"
              >
                Full Name
              </label>

              <input
                id="contact-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="min-h-12 w-full rounded-lg border border-gray-300 px-4 py-3 text-base outline-none transition focus:border-[#285b49] focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div className="min-w-0">
              <label
                htmlFor="contact-email"
                className="mb-2 block text-sm font-semibold"
              >
                Email Address
              </label>

              <input
                id="contact-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                required
                className="min-h-12 w-full rounded-lg border border-gray-300 px-4 py-3 text-base outline-none transition focus:border-[#285b49] focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div className="min-w-0 md:col-span-2">
              <label
                htmlFor="contact-subject"
                className="mb-2 block text-sm font-semibold"
              >
                Subject
              </label>

              <input
                id="contact-subject"
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="What is your message about?"
                required
                className="min-h-12 w-full rounded-lg border border-gray-300 px-4 py-3 text-base outline-none transition focus:border-[#285b49] focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div className="min-w-0 md:col-span-2">
              <label
                htmlFor="contact-message"
                className="mb-2 block text-sm font-semibold"
              >
                Message
              </label>

              <textarea
                id="contact-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message here..."
                rows="5"
                required
                className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-base outline-none transition focus:border-[#285b49] focus:ring-2 focus:ring-green-100"
              />
            </div>

            <a
              href="mailto:hello@visitorhub.com"
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#173d32] px-6 py-3 font-semibold text-white transition hover:bg-[#285b49] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285b49] md:col-span-2"
            >
              Send Message <Send size={18} />
            </a>
          </form>
        </div>
      </section>

      {/* Office Location */}
      <section className="bg-[#173d32] px-4 py-10 text-white sm:px-6 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 flex flex-col gap-4 sm:mb-7 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-green-300 sm:text-sm">
                <MapPin size={17} />
                Find Us
              </p>
              <h2 className="text-2xl font-bold sm:text-3xl">
                Visit Our Office
              </h2>
              <p className="mt-2 max-w-2xl wrap-break-word text-sm leading-6 text-gray-200 sm:text-base">
                Privilon, 312, Sarkhej - Gandhinagar Highway, Vikram Nagar,
                Ahmedabad, Gujarat 380058.
              </p>
            </div>

            <a
              href="https://www.google.com/maps/search/?api=1&query=Privilon%2C%20312%2C%20Sarkhej%20-%20Gandhinagar%20Highway%2C%20Vikram%20Nagar%2C%20Ahmedabad%2C%20Gujarat%20380058"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 w-fit shrink-0 items-center justify-center gap-2 rounded-lg border border-white/20 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-green-300 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-300"
            >
              Get Directions
              <ArrowUpRight size={16} />
            </a>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/15 bg-white/5 p-1.5 shadow-xl shadow-black/20">
            <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl sm:aspect-video">
              <iframe
                title="VisitorHub office location in Ahmedabad"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29375.101539946136!2d72.48490848384719!3d23.02789546312918!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e9b390a555555%3A0xcbbfef21de2b5a37!2sPrivilon%2C%20312%2C%20Sarkhej%20-%20Gandhinagar%20Hwy%2C%20Vikram%20Nagar%2C%20Ahmedabad%2C%20Gujarat%20380058!5e0!3m2!1sen!2sin!4v1792565578425!5m2!1sen!2sin"
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-balance text-center text-2xl font-bold sm:text-3xl">
            Frequently Asked Questions
          </h2>

          <div className="mt-6 space-y-4 sm:mt-8">
            {[
              {
                question: "How can I register for an event?",
                answer:
                  "Explore the available events, select an event, choose a pass, and complete the registration process.",
              },
              {
                question: "Where can I view my registrations?",
                answer:
                  "Log in to your account and open the My Registrations page to view your bookings.",
              },
              {
                question: "Who can help me with a booking issue?",
                answer:
                  "Contact our support team with your registered email address and details of the issue.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="rounded-xl border border-gray-200 p-4 sm:p-5"
              >
                <h3 className="font-bold">{faq.question}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600 sm:text-base">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
