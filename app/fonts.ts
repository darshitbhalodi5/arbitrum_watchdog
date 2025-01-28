import localFont from 'next/font/local'

// Primary Font (for headings and important text)
export const primaryFont = localFont({
    src: [
        {
            path: '../public/fonts/200.ttf',
            weight: '200',
            style: 'normal',
        },
        {
            path: '../public/fonts/300.ttf',
            weight: '300',
            style: 'normal',
        },
        {
            path: '../public/fonts/400.ttf',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../public/fonts/500.ttf',
            weight: '500',
            style: 'normal',
        },
    ],
    variable: '--font-primary'
})

// Secondary Font (for body text)
export const secondaryFont = localFont({
    src: [
        {
            path: '../public/fonts/secondary.otf',
            weight: '300',
            style: 'normal',
        },
    ],
    variable: '--font-secondary'
}) 