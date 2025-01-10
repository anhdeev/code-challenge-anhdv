import Link from "next/link";
import {
  RiYoutubeFill,
  RiFacebookBoxFill,
  RiTwitterFill,
} from "react-icons/ri";

const socials = [
  {
    id: 1,
    icon: <RiYoutubeFill />,
    path: "/#",
  },
  {
    id: 2,
    icon: <RiFacebookBoxFill />,
    path: "/#",
  },
  {
    id: 3,
    icon: <RiTwitterFill />,
    path: "/#",
  },
];

interface SocialsProps {
  containerStyles: string;
  iconStyles: string;
}

function Socials({ containerStyles, iconStyles }: SocialsProps) {
  return (
    <div className={`${containerStyles}`}>
      {socials.map((item) => (
        <Link href={item.path} className={`${iconStyles}`} key={item.id}>
          <div className={`${iconStyles}`}>{item.icon}</div>
        </Link>
      ))}
    </div>
  );
}

export default Socials;
