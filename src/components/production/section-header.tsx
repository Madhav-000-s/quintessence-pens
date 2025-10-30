import React from 'react'

type Props = {
  title: string
  description?: string
  actions?: React.ReactNode
}

export default function SectionHeader({ title, description, actions }: Props) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {description ? (
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 max-w-prose">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="shrink-0 flex items-center gap-2">{actions}</div> : null}
    </div>
  )
}
