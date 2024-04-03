"use client";
import React from "react";
import {
  Container,
  Grid,
  Avatar,
  Button,
  Flex,
  Box,
  Group,
} from "@mantine/core";
import { User } from "@supabase/supabase-js";

const TopNavBar = ({ user }: { user: User | null }) => {
  return (
    <Grid bg={"red"} justify="flex-center" align="flex-center">
      <Grid.Col bg="indigo" span={3}>
        {" "}
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src="/logo.png" // Replace with the path to your logo image
            alt="Logo"
            style={{ width: "32px", height: "32px", marginRight: "8px" }}
          />
          <span style={{ fontSize: "1.25rem", fontWeight: "600" }}>
            Zixnote
          </span>
        </div>
      </Grid.Col>
      <Grid.Col bg="gray" span={6}>
        2
      </Grid.Col>
      <Grid.Col bg="indigo" span={3} >
        <Group justify="flex-end" bg="red" >
          {" "}
          {user ? (
            <Flex align={"center"}>
              <span style={{ marginRight: "8px" }}>{user.email}</span>
              <Avatar
                src={user?.user_metadata.avatar_url || "/default-avatar.png"} // Replace with the path to your default avatar image
                alt="Avatar"
                radius="md"
              />
            </Flex>
          ) : (
            <Button
              component="a"
              href="/login"
              style={{ textDecoration: "none" }}
              variant="link"
            >
              Log In
            </Button>
          )}
        </Group>
      </Grid.Col>
    </Grid>
  );
};

export default TopNavBar;
