import { UserButton } from "@daveyplate/better-auth-ui";
import Link from "next/link";
import { ThemeToggle } from "../theme/toggle";
import { Icon } from "../ui/icon";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between p-4">
      <section>
        <Link href="/">
          <Icon icon="line-md:home" className="size-8" />
        </Link>
      </section>
      <section className="flex gap-2 items-center">
        <Link href="/create">
          <Icon icon="line-md:plus" className="size-8" />
        </Link>
        <ThemeToggle />
        <UserButton
          classNames={{
            trigger: {
              base: "inline-flex items-center justify-center rounded-md size-10 border border-border",
              avatar: {
                base: "rounded-md size-full",
              },
            },
          }}
        />
      </section>
    </header>
  );
};
