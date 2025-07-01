import { signOut } from "@/app/action";
import {
  ActionIcon,
  Avatar,
  Group,
  Menu,
  Text,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { User } from "@supabase/supabase-js";
import { IconChevronRight, IconLogout } from "@tabler/icons-react";

export function UserMenu({ user }: { user: User | null }) {
  const theme = useMantineTheme();
  return (
    <Group justify="center">
      <Menu
        withArrow
        width={300}
        position="bottom"
        transitionProps={{ transition: "pop" }}
        withinPortal
      >
        <Menu.Target>
          <ActionIcon variant="light" radius={"xl"} size={"lg"}>
            <Avatar
              src={user?.user_metadata.avatar_url} // Replace with the path to your default avatar image
              alt="Avatar"
            />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            rightSection={
              <IconChevronRight
                style={{ width: rem(16), height: rem(16) }}
                stroke={1.5}
              />
            }
          >
            <Group>
              <Avatar radius="xl" src={user?.user_metadata.avatar_url} />

              <div>
                <Text fw={500}>{user?.user_metadata.full_name}</Text>
                <Text size="xs" c="dimmed">
                  {user?.email}
                </Text>
              </div>
            </Group>
          </Menu.Item>

          <Menu.Divider />

          {/* <Menu.Item
            leftSection={
              <IconHeart
                style={{ width: rem(16), height: rem(16) }}
                stroke={1.5}
                color={theme.colors.red[6]}
              />
            }
          >
            Liked posts
          </Menu.Item>
          <Menu.Item
            leftSection={
              <IconStar
                style={{ width: rem(16), height: rem(16) }}
                stroke={1.5}
                color={theme.colors.yellow[6]}
              />
            }
          >
            Saved posts
          </Menu.Item>
          <Menu.Item
            leftSection={
              <IconMessage
                style={{ width: rem(16), height: rem(16) }}
                stroke={1.5}
                color={theme.colors.blue[6]}
              />
            }
          >
            Your comments
          </Menu.Item> */}

          {/* <Menu.Label>Settings</Menu.Label>
          <Menu.Item
            leftSection={
              <IconSettings
                style={{ width: rem(16), height: rem(16) }}
                stroke={1.5}
              />
            }
          >
            Account settings
          </Menu.Item>
          <Menu.Item
            leftSection={
              <IconSwitchHorizontal
                style={{ width: rem(16), height: rem(16) }}
                stroke={1.5}
              />
            }
          >
            Change account
          </Menu.Item> */}
          <form action={signOut}>
            <Menu.Item
              type="submit"
              leftSection={
                <IconLogout
                  style={{ width: rem(16), height: rem(16) }}
                  stroke={1.5}
                />
              }
            >
              Logout
            </Menu.Item>
          </form>
          {/* <Menu.Divider />

          <Menu.Label>Danger zone</Menu.Label>
          <Menu.Item
            leftSection={
              <IconPlayerPause
                style={{ width: rem(16), height: rem(16) }}
                stroke={1.5}
              />
            }
          >
            Pause subscription
          </Menu.Item>
          <Menu.Item
            color="red"
            leftSection={
              <IconTrash
                style={{ width: rem(16), height: rem(16) }}
                stroke={1.5}
              />
            }
          >
            Delete account
          </Menu.Item> */}
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}
