export default async function RootLayout({ params }) {
    const user = (await params).user

    const data = await fetch('http://localhost:3000/api/user/' + user)
    const user_data = await data.json()
    return (
    <>
        <h1>sameSite</h1>
    </>
    )
}
