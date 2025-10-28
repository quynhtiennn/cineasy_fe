import BookingPage from "@/components/booking-process"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <BookingPage bookingId={id} />
}