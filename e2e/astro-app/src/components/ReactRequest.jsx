import { useState } from "react";
import useSWR from "swr";
import ky from "ky";

const URL = "https://dog.ceo/api/breeds/image/random";

// interface IImageRes {
//   message: string;
//   status: string;
// }

export default function ReactRequest() {
  // const {
  //   data: { message: imgURL },
  //   error,
  // } = useSWR("/", () => ky.get(URL).json());

  // console.log("imgURL: ", imgURL);

  return (
    <div id="react-request" className="request">
      {/* <img src={imgURL} /> */}
    </div>
  );
}
