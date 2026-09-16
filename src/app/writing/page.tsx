import { permanentRedirect } from 'next/navigation'

export default function WritingRedirect() {
  permanentRedirect('/blog')
}
