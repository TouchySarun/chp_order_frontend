import React, { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

interface DropdownProps {
  disable: boolean;
  options: string[];
  select: string;
  setSelect: (s: string) => void;
}

const Dropdown: React.FC<DropdownProps & React.ComponentProps<"div">> = ({
  options,
  select,
  setSelect, // Custom prop
  ...props // Rest of the props (className, onClick, etc.)
}) => {
  return (
    <Menu
      as="div"
      className={"relative inline-block text-left " + props.className}
    >
      <div>
        {props.disable ? (
          <p className="text-gray-400">{select}</p>
        ) : (
          <MenuButton className="inline-flex justify-between w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            {select}
            <FontAwesomeIcon icon={faCaretDown} />
          </MenuButton>
        )}
      </div>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
      >
        <div className="py-1">
          {options.map((option) => (
            <MenuItem key={option}>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                onClick={() => setSelect(option)}
              >
                {option}
              </a>
            </MenuItem>
          ))}
        </div>
      </MenuItems>
    </Menu>
  );
};

export default Dropdown;
