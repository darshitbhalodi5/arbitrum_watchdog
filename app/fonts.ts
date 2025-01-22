import localFont from 'next/font/local'

// Primary Font (for headings and important text)
export const primaryFont = localFont({
    src: [
        {
            path: '../public/fonts/Archivo-Light.ttf',
            weight: '300',
            style: 'normal',
        },
        {
            path: '../public/fonts/Archivo-Regular.ttf',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../public/fonts/Archivo-Medium.ttf',
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
            path: '../public/fonts/Nunito-Light.ttf',
            weight: '300',
            style: 'normal',
        },
        {
            path: '../public/fonts/Nunito-Regular.ttf',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../public/fonts/Nunito-Medium.ttf',
            weight: '500',
            style: 'normal',
        },
    ],
    variable: '--font-secondary'
}) 