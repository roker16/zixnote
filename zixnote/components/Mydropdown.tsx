import { Menu } from "@headlessui/react";

function MyDropdown() {
  return (
    <Menu>
      <Menu.Button className="btn">More</Menu.Button>

      <Menu.Items className="menu rounded-box bg-base-200 w-52">
        <ul className="menu bg-base-200 w-56 rounded-box">
          <li>
            <h2 className="menu-title">Title</h2>
            <ul>
              <li>
                <a>Item 1</a>
              </li>
              <li>
                <a>Item 2</a>
              </li>
              <li>
                <a>Item 3</a>
              </li>
            </ul>
          </li>
        </ul>
        <Menu.Item>
          {({ active }) => (
            <a
              className={`${active && "bg-blue-500"}`}
              href="/account-settings"
            >
              Account settings
            </a>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <a
              className={`${active && "bg-blue-500"}`}
              href="/account-settings"
            >
              Documentation
            </a>
          )}
        </Menu.Item>
        <Menu.Item disabled>
          <span className="opacity-75">Invite a friend (coming soon!)</span>
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );
}
export default MyDropdown;
