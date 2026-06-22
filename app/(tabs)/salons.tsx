import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const SALONS = [
  {
    id: '1',
    name: 'Craft & Blade Barbershop',
    address: 'Nasugbu, Batangas',
    distance: '0.3 km',
    rating: 4.9,
    reviews: 128,
    open: true,
    hours: '8:00 AM – 7:00 PM',
    services: ['Haircut', 'Fade', 'Beard Trim', 'Hair Color'],
    price: '₱150 – ₱500',
    specialties: ['Fades', 'Classic Cuts'],
    emoji: '✂️',
    slots: ['9:00 AM', '10:30 AM', '2:00 PM', '4:00 PM'],
  },
  {
    id: '2',
    name: 'Styled by Ana',
    address: 'Brgy. Poblacion, Nasugbu',
    distance: '0.7 km',
    rating: 4.7,
    reviews: 86,
    open: true,
    hours: '9:00 AM – 6:00 PM',
    services: ['Haircut', 'Hair Treatment', 'Rebond', 'Color'],
    price: '₱200 – ₱1,200',
    specialties: ['Treatments', 'Color'],
    emoji: '💇',
    slots: ['10:00 AM', '1:00 PM', '3:30 PM'],
  },
  {
    id: '3',
    name: 'The Gentlemen\'s Den',
    address: 'Nasugbu, Batangas',
    distance: '1.2 km',
    rating: 4.6,
    reviews: 214,
    open: false,
    hours: '10:00 AM – 8:00 PM',
    services: ['Haircut', 'Shave', 'Beard Styling', 'Scalp Treatment'],
    price: '₱200 – ₱600',
    specialties: ['Beard', 'Premium Cuts'],
    emoji: '🪒',
    slots: [],
  },
  {
    id: '4',
    name: 'Luxe Hair Studio',
    address: 'Brgy. Calayo, Nasugbu',
    distance: '1.8 km',
    rating: 4.5,
    reviews: 57,
    open: true,
    hours: '9:00 AM – 7:00 PM',
    services: ['Haircut', 'Keratin', 'Highlights', 'Perms'],
    price: '₱300 – ₱2,000',
    specialties: ['Keratin', 'Highlights'],
    emoji: '👑',
    slots: ['11:00 AM', '2:00 PM', '5:00 PM'],
  },
];

const SERVICES_FILTER = ['All', 'Haircut', 'Fade', 'Treatment', 'Color', 'Beard'];

export default function SalonsScreen() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedSalon, setSelectedSalon] = useState<typeof SALONS[0] | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [bookingDone, setBookingDone] = useState(false);

  const handleBook = () => {
    if (selectedSlot) {
      setBookingDone(true);
      setTimeout(() => {
        setBookingDone(false);
        setSelectedSalon(null);
        setSelectedSlot(null);
      }, 2000);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F0F0F" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.screenLabel}>NEARBY SALONS</Text>
          <Text style={styles.screenTitle}>Find a Salon</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={14} color="#C9A96E" />
            <Text style={styles.locationText}>Nasugbu, Batangas · 4 salons found</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#555" style={{ marginRight: 10 }} />
          <Text style={styles.searchPlaceholder}>Search salons, services…</Text>
        </View>

        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          {SERVICES_FILTER.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterPill, activeFilter === f && styles.filterPillActive]}
              onPress={() => setActiveFilter(f)}
            >
              <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Salon Cards */}
        <View style={styles.salonsContainer}>
          {SALONS.map((salon) => (
            <TouchableOpacity
              key={salon.id}
              style={styles.salonCard}
              onPress={() => setSelectedSalon(salon)}
              activeOpacity={0.88}
            >
              <View style={styles.salonHeader}>
                <View style={styles.salonEmoji}>
                  <Text style={{ fontSize: 28 }}>{salon.emoji}</Text>
                </View>
                <View style={styles.salonInfo}>
                  <View style={styles.salonTitleRow}>
                    <Text style={styles.salonName}>{salon.name}</Text>
                    <View style={[styles.openBadge, !salon.open && styles.closedBadge]}>
                      <Text style={[styles.openText, !salon.open && styles.closedText]}>
                        {salon.open ? 'Open' : 'Closed'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.salonMeta}>
                    <Ionicons name="location-outline" size={12} color="#888" />
                    <Text style={styles.salonAddress}> {salon.address}</Text>
                    <Text style={styles.salonDot}>·</Text>
                    <Text style={styles.salonDist}>{salon.distance}</Text>
                  </View>
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={12} color="#C9A96E" />
                    <Text style={styles.ratingText}> {salon.rating}</Text>
                    <Text style={styles.reviewsText}> ({salon.reviews} reviews)</Text>
                  </View>
                </View>
              </View>

              {/* Services */}
              <View style={styles.servicesRow}>
                {salon.services.slice(0, 3).map((s) => (
                  <View key={s} style={styles.serviceChip}>
                    <Text style={styles.serviceChipText}>{s}</Text>
                  </View>
                ))}
                {salon.services.length > 3 && (
                  <View style={styles.serviceChip}>
                    <Text style={styles.serviceChipText}>+{salon.services.length - 3}</Text>
                  </View>
                )}
              </View>

              {/* Price & Book */}
              <View style={styles.salonFooter}>
                <Text style={styles.salonPrice}>{salon.price}</Text>
                {salon.open ? (
                  <TouchableOpacity
                    style={styles.bookBtn}
                    onPress={() => setSelectedSalon(salon)}
                  >
                    <Text style={styles.bookBtnText}>Book</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.bookBtnDisabled}>
                    <Text style={styles.bookBtnDisabledText}>Closed</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Booking Modal */}
      <Modal
        visible={selectedSalon !== null}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedSalon(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />

            {bookingDone ? (
              <View style={styles.bookingSuccess}>
                <Ionicons name="checkmark-circle" size={56} color="#4ECDC4" />
                <Text style={styles.successTitle}>Appointment Booked!</Text>
                <Text style={styles.successSub}>
                  {selectedSalon?.name} · {selectedSlot}
                </Text>
              </View>
            ) : (
              selectedSalon && (
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={styles.modalHeader}>
                    <Text style={{ fontSize: 36 }}>{selectedSalon.emoji}</Text>
                    <View style={{ flex: 1, marginLeft: 14 }}>
                      <Text style={styles.modalSalonName}>{selectedSalon.name}</Text>
                      <View style={styles.ratingRow}>
                        <Ionicons name="star" size={13} color="#C9A96E" />
                        <Text style={styles.ratingText}> {selectedSalon.rating}</Text>
                        <Text style={styles.reviewsText}> ({selectedSalon.reviews} reviews)</Text>
                      </View>
                    </View>
                    <TouchableOpacity onPress={() => setSelectedSalon(null)}>
                      <Ionicons name="close" size={22} color="#888" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalLabel}>Hours</Text>
                    <Text style={styles.modalValue}>{selectedSalon.hours}</Text>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalLabel}>Services</Text>
                    <View style={styles.servicesRow}>
                      {selectedSalon.services.map((s) => (
                        <View key={s} style={styles.serviceChip}>
                          <Text style={styles.serviceChipText}>{s}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  {selectedSalon.slots.length > 0 && (
                    <View style={styles.modalSection}>
                      <Text style={styles.modalLabel}>Available Slots Today</Text>
                      <View style={styles.slotsGrid}>
                        {selectedSalon.slots.map((slot) => (
                          <TouchableOpacity
                            key={slot}
                            style={[styles.slotPill, selectedSlot === slot && styles.slotPillActive]}
                            onPress={() => setSelectedSlot(slot)}
                          >
                            <Text style={[styles.slotText, selectedSlot === slot && styles.slotTextActive]}>
                              {slot}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  )}

                  <TouchableOpacity
                    style={[styles.confirmBtn, !selectedSlot && styles.confirmBtnDisabled]}
                    onPress={handleBook}
                    disabled={!selectedSlot}
                  >
                    <Ionicons name="calendar" size={16} color="#0F0F0F" style={{ marginRight: 8 }} />
                    <Text style={styles.confirmBtnText}>Confirm Appointment</Text>
                  </TouchableOpacity>
                </ScrollView>
              )
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F0F' },
  scroll: { paddingBottom: 30 },
  header: { paddingTop: 54, paddingHorizontal: 20, paddingBottom: 20 },
  screenLabel: { fontSize: 10, color: '#C9A96E', letterSpacing: 2.5, fontWeight: '700', marginBottom: 4 },
  screenTitle: { fontSize: 26, fontWeight: '800', color: '#F5F0E8', letterSpacing: -0.5, marginBottom: 6 },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  locationText: { fontSize: 13, color: '#888', marginLeft: 4 },

  // Search
  searchBar: { marginHorizontal: 20, marginBottom: 16, flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A1A', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1, borderColor: '#2A2A2A' },
  searchPlaceholder: { fontSize: 14, color: '#555' },

  // Filters
  filterScroll: { marginBottom: 20 },
  filterPill: { paddingVertical: 7, paddingHorizontal: 14, borderRadius: 20, backgroundColor: '#1A1A1A', marginRight: 8, borderWidth: 1, borderColor: '#2A2A2A' },
  filterPillActive: { backgroundColor: '#C9A96E', borderColor: '#C9A96E' },
  filterText: { fontSize: 13, color: '#888', fontWeight: '600' },
  filterTextActive: { color: '#0F0F0F' },

  // Salons
  salonsContainer: { paddingHorizontal: 20, gap: 14 },
  salonCard: { backgroundColor: '#1A1A1A', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#2A2A2A' },
  salonHeader: { flexDirection: 'row', marginBottom: 12 },
  salonEmoji: { width: 54, height: 54, borderRadius: 14, backgroundColor: '#2A1F10', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  salonInfo: { flex: 1 },
  salonTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  salonName: { fontSize: 15, fontWeight: '700', color: '#F5F0E8', flex: 1, marginRight: 8 },
  openBadge: { backgroundColor: '#4ECDC422', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, borderWidth: 1, borderColor: '#4ECDC455' },
  closedBadge: { backgroundColor: '#FF6B6B22', borderColor: '#FF6B6B55' },
  openText: { fontSize: 10, fontWeight: '700', color: '#4ECDC4' },
  closedText: { color: '#FF6B6B' },
  salonMeta: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  salonAddress: { fontSize: 11, color: '#888' },
  salonDot: { fontSize: 11, color: '#555', marginHorizontal: 4 },
  salonDist: { fontSize: 11, color: '#C9A96E', fontWeight: '600' },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 13, color: '#C9A96E', fontWeight: '700' },
  reviewsText: { fontSize: 11, color: '#666' },

  // Services
  servicesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  serviceChip: { backgroundColor: '#2A2A2A', paddingHorizontal: 9, paddingVertical: 4, borderRadius: 8 },
  serviceChipText: { fontSize: 11, color: '#AAA' },

  // Footer
  salonFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  salonPrice: { fontSize: 14, color: '#C9A96E', fontWeight: '700' },
  bookBtn: { backgroundColor: '#C9A96E', paddingHorizontal: 18, paddingVertical: 8, borderRadius: 10 },
  bookBtnText: { fontSize: 13, fontWeight: '700', color: '#0F0F0F' },
  bookBtnDisabled: { backgroundColor: '#2A2A2A', paddingHorizontal: 18, paddingVertical: 8, borderRadius: 10 },
  bookBtnDisabledText: { fontSize: 13, fontWeight: '700', color: '#555' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: '#000000AA', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: '#1A1A1A', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '85%' },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#333', alignSelf: 'center', marginBottom: 20 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  modalSalonName: { fontSize: 18, fontWeight: '800', color: '#F5F0E8', letterSpacing: -0.3 },
  modalSection: { marginBottom: 20 },
  modalLabel: { fontSize: 12, color: '#888', fontWeight: '600', marginBottom: 8, letterSpacing: 0.5 },
  modalValue: { fontSize: 14, color: '#F5F0E8' },
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  slotPill: { paddingVertical: 9, paddingHorizontal: 16, borderRadius: 10, backgroundColor: '#2A2A2A', borderWidth: 1, borderColor: '#3A3A3A' },
  slotPillActive: { backgroundColor: '#C9A96E22', borderColor: '#C9A96E' },
  slotText: { fontSize: 13, color: '#888', fontWeight: '600' },
  slotTextActive: { color: '#C9A96E' },
  confirmBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#C9A96E', paddingVertical: 15, borderRadius: 14, marginTop: 8 },
  confirmBtnDisabled: { opacity: 0.4 },
  confirmBtnText: { fontSize: 15, fontWeight: '700', color: '#0F0F0F' },

  // Success
  bookingSuccess: { alignItems: 'center', paddingVertical: 40 },
  successTitle: { fontSize: 22, fontWeight: '800', color: '#F5F0E8', marginTop: 16, marginBottom: 6 },
  successSub: { fontSize: 14, color: '#888', textAlign: 'center' },
});