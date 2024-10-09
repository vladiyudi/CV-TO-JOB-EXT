import React, {useEffect, useState} from 'react'
import { FadeText } from '../ui/fade-text'
import BlurIn from '../ui/blur-in'
import WordRotate from "@/components/ui/word-rotate";

export default function ShowMatch({nameTitle}) {
    const [showText, setShowText] = useState(false)

    useEffect(() => {
        setShowText(true)
        const timeOut = setTimeout(() => {
           setShowText(false)
        }, 3000)

        return () => clearTimeout(timeOut)
    }, [nameTitle])

  return (
    <div className='rajdhani-regular text-2xl flex justify-center mt-10 gap-4 items-center h-[20px]'>
        
        {! showText && <FadeText
          direction="left"
          framerProps={{
            show: { transition: { delay: 0.1 } },
          }}
          text={nameTitle.name}
         /> }
          {showText && nameTitle.title && nameTitle.name && 
          <div className='fade-out'>
          <WordRotate words={["Match"]} className={"rajdhani-bold text-4xl fade-out"}/>
          </div>}
          {! showText && <FadeText
          direction="right"
          framerProps={{
            show: { transition: { delay:0.1 } },
          }}
          text={nameTitle.title}
         />
        }
    </div>
  )
}
