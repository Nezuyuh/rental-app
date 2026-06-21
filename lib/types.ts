export interface Motorcycle {
  id: string
  name: string
  type: string
  description: string | null
  price_per_day: number
  location: string
  image_url: string | null
  is_available: boolean
  rating: number
  review_count: number
  created_at: string
}

export interface Profile {
  id: string
  full_name: string | null
  phone: string | null
  avatar_url: string | null
  role: 'customer' | 'admin'
  created_at: string
}

export interface Booking {
  id: string
  user_id: string
  motorcycle_id: string
  start_date: string
  end_date: string
  total_days: number
  total_price: number
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled'
  payment_method: 'cash' | 'gcash' | 'card'
  payment_status: 'pending' | 'paid'
  notes: string | null
  created_at: string
  motorcycle?: Motorcycle
  profile?: Profile
}
