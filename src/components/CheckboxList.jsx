import React from "react";
import { Checkbox } from "./ui/checkbox";
function CheckboxList({items, setItems, filterAttribute, displayAttribute}) {
  console.log(filterAttribute);
  console.log(displayAttribute);
  
  
  const onCheckboxChange = (item) => {
    setItems((prevItems) => {
      // Check if the item is already in the array
      const itemIndex = prevItems.indexOf(item);
      if (itemIndex === -1) {
        // If not found, add it to the array
        return [...prevItems, item];
      } else {
        // If found, remove it from the array
        return prevItems.filter((item) => item !== item);
      }
    });
  };

  return (
    <ul>
      {items.map((item) => (
        <li key={item[`${filterAttribute}`]}>
          <Checkbox onClick={() => onCheckboxChange(item[`${filterAttribute}`])} />
          {item[`${displayAttribute}`]}
        </li>
      ))}
    </ul>
  );
}

export default CheckboxList;