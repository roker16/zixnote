"use client";

import { Card, Text } from "@mantine/core";
import Image from "next/image";

export default function Testimonial() {
  return (
    <Card
      shadow="lg"
      radius="xl"
      padding="xl"
      withBorder
      className="max-w-xl mx-auto bg-white"
    >
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-16 h-16 relative rounded-full overflow-hidden border border-gray-300">
          <Image
            src="/drabhi.png"
            alt="Dr. Anand Srivastava"
            fill
            className="object-cover"
          />
        </div>
        <div>
          <Text fw={700} size="lg" className="text-gray-900">
            Dr. Anand Srivastava
          </Text>
          <Text c="dimmed" size="sm">
            Renowned Radiologist, Lucknow
          </Text>
        </div>
      </div>

      <Text size="md" className="text-gray-700 leading-relaxed mb-3">
        “Dizinote{" "}
        <span className="font-semibold text-indigo-700 italic">
          Integrates AI
        </span>{" "}
        to create factually accurate, well-structured notes that align perfectly
        with the MBBS syllabus. It minimizes the effort spent on manual
        note-making, allowing both professors and students to concentrate on the
        most critical and high-impact areas of medical education.”
      </Text>

      <Text
        size="md"
        fw={600}
        className="text-indigo-700 leading-relaxed italic"
      >
        I strongly recommend Dizinote to medical institutions, professors, and
        students who value precision, efficiency, and modern learning tools in
        their academic journey.
      </Text>
    </Card>
  );
}
