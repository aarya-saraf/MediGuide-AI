import ConsultNow from '../../../components/ConsultNow';

export default async function ChatPage({ params }) {
    // Await params as required by Next.js 15+ App Router
    const { id } = await params;
    return <ConsultNow doctorId={id} />;
}
