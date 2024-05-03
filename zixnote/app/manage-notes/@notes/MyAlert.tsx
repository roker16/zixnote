import { Alert } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { ReactNode } from "react";

export function MyAlert({
  title,
  detail,
}: {
  title: string;
  detail: string | ReactNode;
}) {
  return (
    <Alert variant="light" color="blue" title={title} icon={<IconInfoCircle />}>
      {detail}
    </Alert>
  );
}
