import { Github } from "@medusajs/icons";
import { Heading } from "@medusajs/ui";
import Image from "next/image";


const Hero = () => {
  return (
    <div className="h-[75vh] w-full border-b border-ui-border-base relative bg-ui-bg-subtle">
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:p-32 gap-6">
        <span>
          <Heading
            level="h1"
            className="text-3xl leading-10 text-ui-fg-base font-normal"
          >

          </Heading>
          <Heading
            level="h2"
            className="text-xsleading-10 text-ui-fg-subtle font-normal"
          >
            <div className="mb-5">
              <Image src="/coverimage.png" alt="" width={1000} height={500}></Image>
            </div>
            
            <a href="/store" className="bg-orange-950 rounded-xl text-base-regular text-white p-2">Explore Products</a>
          </Heading>
        </span>
       
      </div>
    </div>
  )
}

export default Hero
