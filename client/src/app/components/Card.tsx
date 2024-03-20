import React, { FC } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Button,
  Image,
  Slider,
  Link,
} from "@nextui-org/react";
import { RepeatOneIcon } from "@/icons/RepeatOneIcon";
import { PreviousIcon } from "@/icons/PreviousIcon";
import { PauseCircleIcon } from "@/icons/PauseCircleIcon";
import { NextIcon } from "@/icons/NextIcon";
import { ShuffleIcon } from "@/icons/ShuffleIcon";

interface Blog {
    href: string
}

export const CardBlog: FC<Blog> = (props) => {
  const [isFollowed, setIsFollowed] = React.useState(false);

  return (
    <Card className="max-w-full">
      <CardHeader className="justify-between">
        <div className="flex gap-3">
          <Avatar
            isBordered
            radius="full"
            size="md"
            src="https://scontent.fpnh2-2.fna.fbcdn.net/v/t39.30808-6/427897563_1993282961086601_1417045370339454855_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeGx91sS9aAeVuK6cxxQiOmoPmiF_T4VO3M-aIX9PhU7c_nTZFIS-__ZCSHR4k-Pir0WtF3L_0Zmy6YTQNVEAD72&_nc_ohc=TLfXARw72ZoAX-by50O&_nc_zt=23&_nc_ht=scontent.fpnh2-2.fna&oh=00_AfBeyUOTG6r0MRukhZmdcoD-GKrDQOeSwUaisvT_uaozrQ&oe=65FB350E"
          />
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">
              Zoey Lang
            </h4>
            <h5 className="text-small tracking-tight text-default-400">
              @zoeylang
            </h5>
          </div>
        </div>
        <Button
          className={
            isFollowed
              ? "bg-transparent text-foreground border-default-200"
              : ""
          }
          color="primary"
          radius="full"
          size="sm"
          variant={isFollowed ? "bordered" : "solid"}
          onPress={() => setIsFollowed(!isFollowed)}
        >
          {isFollowed ? "Unfollow" : "Follow"}
        </Button>
      </CardHeader>
      <CardBody className="px-3 py-0 text-small text-default-400 mb-10">
        <div className="w-full h-40">
          <Image
            radius="lg"
            className="h-40 w-full object-cover"
            src="https://en-ambi.com/image/article_hub/60/62/260_01.jpg"
            alt=""
          />
        </div>
        <div className="pt-3 space-y-2">
          <Link href={`/blogs/${props.href}`} className="text-gray-800 text-xl font-bold leading-tight hover:text-primary cursor-pointer">
            Learn typescript beginning to zero
          </Link>
          <p>
            Frontend developer and UI/UX enthusiast. Join me on this coding
            adventure!
          </p>
        </div>
      </CardBody>
      <CardFooter className="absolute bg-white/30 bottom-0 z-10 justify-between px-3 pt-2 pb-4">
        <div>
          <p className="text-black text-tiny">Get notified.</p>
        </div>
        {/* <Button className="text-tiny" color="primary" radius="full" size="sm">
          Read Me
        </Button> */}
      </CardFooter>
    </Card>
  );
};

export const CardBook = () => {
  const [isFollowed, setIsFollowed] = React.useState(false);
  return (
    <Card className="max-w-full">
      <CardHeader className="justify-between">
        <div className="flex gap-3">
          <Avatar
            isBordered
            radius="full"
            size="md"
            src="https://scontent.fpnh2-2.fna.fbcdn.net/v/t39.30808-6/427897563_1993282961086601_1417045370339454855_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeGx91sS9aAeVuK6cxxQiOmoPmiF_T4VO3M-aIX9PhU7c_nTZFIS-__ZCSHR4k-Pir0WtF3L_0Zmy6YTQNVEAD72&_nc_ohc=TLfXARw72ZoAX-by50O&_nc_zt=23&_nc_ht=scontent.fpnh2-2.fna&oh=00_AfBeyUOTG6r0MRukhZmdcoD-GKrDQOeSwUaisvT_uaozrQ&oe=65FB350E"
          />
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">
              Vann Soklay
            </h4>
            <h5 className="text-small tracking-tight text-default-400">
              @lay512
            </h5>
          </div>
        </div>
        {/* <Button
          className={
            isFollowed
              ? "bg-transparent text-foreground border-default-200"
              : ""
          }
          color="primary"
          radius="full"
          size="sm"
          variant={isFollowed ? "bordered" : "solid"}
          onPress={() => setIsFollowed(!isFollowed)}
        >
          {isFollowed ? "Unfollow" : "Follow"}
        </Button> */}
      </CardHeader>
      <CardBody className="px-3 py-0 text-small text-default-400">
        <Image
          radius="lg"
          className="h-56 object-cover"
          src="https://static01.nyt.com/images/2020/11/15/business/15obamabook-print2/15obamabook-print2-mediumSquareAt3X-v3.jpg"
          alt=""
        />
      </CardBody>
      <CardFooter className="justify-between before:bg-white/10 z-10">
        <div className="w-full">
          <p className="text-black text-sm text-start pl-0.5">A promise land</p>
        </div>
        <Button
          className="text-tiny text-white bg-black/20"
          variant="flat"
          color="primary"
          radius="lg"
          size="sm"
        >
          Read
        </Button>
      </CardFooter>
    </Card>
  );
};

export const CardAudio = () => {
  const [isFollowed, setIsFollowed] = React.useState(false);
  //   const [liked, setLiked] = React.useState(false);
  return (
    <Card className="max-w-full">
      <CardHeader className="justify-between">
        <div className="flex gap-3">
          <Avatar
            isBordered
            radius="full"
            size="md"
            src="https://scontent.fpnh2-2.fna.fbcdn.net/v/t39.30808-6/427897563_1993282961086601_1417045370339454855_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeGx91sS9aAeVuK6cxxQiOmoPmiF_T4VO3M-aIX9PhU7c_nTZFIS-__ZCSHR4k-Pir0WtF3L_0Zmy6YTQNVEAD72&_nc_ohc=TLfXARw72ZoAX-by50O&_nc_zt=23&_nc_ht=scontent.fpnh2-2.fna&oh=00_AfBeyUOTG6r0MRukhZmdcoD-GKrDQOeSwUaisvT_uaozrQ&oe=65FB350E"
          />
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">
              Zoey Lang
            </h4>
            <h5 className="text-small tracking-tight text-default-400">
              @zoeylang
            </h5>
          </div>
        </div>
        <Button
          className={
            isFollowed
              ? "bg-transparent text-foreground border-default-200"
              : ""
          }
          color="primary"
          radius="full"
          size="sm"
          variant={isFollowed ? "bordered" : "solid"}
          onPress={() => setIsFollowed(!isFollowed)}
        >
          {isFollowed ? "Unfollow" : "Follow"}
        </Button>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-center justify-center">
          <div className="relative col-span-6 md:col-span-4">
            <Image
              alt="Album cover"
              className="object-cover"
              height={200}
              shadow="md"
              src="https://m.media-amazon.com/images/I/51SMqlnTBmL.jpg"
              width="100%"
            />
          </div>

          <div className="flex flex-col col-span-6 md:col-span-8">
            <div className="flex flex-col mt-3 gap-1">
              <Slider
                aria-label="Music progress"
                classNames={{
                  track: "bg-default-500/30",
                  thumb: "w-2 h-2 after:w-2 after:h-2 after:bg-foreground",
                }}
                color="foreground"
                defaultValue={33}
                size="sm"
              />
              <div className="flex justify-between">
                <p className="text-small">1:23</p>
                <p className="text-small text-foreground/50">4:32</p>
              </div>
            </div>

            <div className="flex w-full items-center justify-center">
              <Button
                isIconOnly
                className="data-[hover]:bg-foreground/10"
                radius="full"
                variant="light"
              >
                <RepeatOneIcon className="text-foreground/80" />
              </Button>
              <Button
                isIconOnly
                className="data-[hover]:bg-foreground/10"
                radius="full"
                variant="light"
              >
                <PreviousIcon />
              </Button>
              <Button
                isIconOnly
                className="w-auto h-auto data-[hover]:bg-foreground/10"
                radius="full"
                variant="light"
              >
                <PauseCircleIcon size={54} />
              </Button>
              <Button
                isIconOnly
                className="data-[hover]:bg-foreground/10"
                radius="full"
                variant="light"
              >
                <NextIcon />
              </Button>
              <Button
                isIconOnly
                className="data-[hover]:bg-foreground/10"
                radius="full"
                variant="light"
              >
                <ShuffleIcon className="text-foreground/80" />
              </Button>
            </div>
          </div>
        </div>
      </CardBody>

      <CardFooter className="gap-3">
        {/* <div className="flex gap-1">
          <p className="font-semibold text-default-400 text-small">4</p>
          <p className=" text-default-400 text-small">Following</p>
        </div>
        <div className="flex gap-1">
          <p className="font-semibold text-default-400 text-small">97.1K</p>
          <p className="text-default-400 text-small">Followers</p>
        </div> */}
      </CardFooter>
    </Card>
  );
};
