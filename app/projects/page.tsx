import Card from '@/components/Card'
import projectsData from '@/data/projectsData'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'Projects',
  description: 'Example projects for the NextPaper template',
})

export default function Projects() {
  return (
    <main id="main-content" className="pb-4">
      <div className="pt-8 pb-6">
        <h1 className="text-2xl font-semibold sm:text-3xl">Projects</h1>
        <p className="mt-2 mb-6 italic">
          A lightweight projects page kept as part of the public NextPaper template.
        </p>

        <ul>
          {projectsData.map((project) => (
            <li key={project.title}>
              <Card
                title={project.title}
                description={project.description}
                imgSrc={project.imgSrc}
                href={project.href}
              />
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
