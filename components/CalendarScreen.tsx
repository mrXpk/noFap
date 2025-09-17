import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface CalendarScreenProps {
  onBack: () => void;
  onNavigateToCheckIn?: (date: string) => void;
}

interface DayData {
  date: number;
  status: 'success' | 'relapse' | 'future' | 'empty';
  note?: string;
  fapped?: boolean;
}

interface CalendarData {
  [key: string]: DayData;
}

const { width } = Dimensions.get('window');
const daySize = (width - 60) / 7; // 7 days in a week, accounting for padding

export default function CalendarScreen({ onBack, onNavigateToCheckIn }: CalendarScreenProps) {
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
  const [showDayModal, setShowDayModal] = useState(false);
  const [dayNote, setDayNote] = useState('');
  const [fappedToday, setFappedToday] = useState<boolean | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarData, setCalendarData] = useState<CalendarData>({});

  const monthlyQuotes = [
    "Discipline is choosing between what you want now and what you want most.",
    "Your character is built day by day through small acts of discipline.",
    "The journey of a thousand miles begins with a single step.",
    "Strength does not come from what you can do. It comes from overcoming the things you once thought you couldn't.",
    "Every day is a new beginning, take a deep breath and start again."
  ];

  useEffect(() => {
    // Initialize demo data for calendar
    const demoData: CalendarData = {
      '2025-09-01': { date: 1, status: 'success', fapped: false, note: 'Started strong!' },
      '2025-09-02': { date: 2, status: 'success', fapped: false },
      '2025-09-03': { date: 3, status: 'relapse', fapped: true, note: 'Struggled today, but tomorrow is a new day' },
      '2025-09-04': { date: 4, status: 'success', fapped: false },
      '2025-09-05': { date: 5, status: 'success', fapped: false },
      '2025-09-15': { date: 15, status: 'success', fapped: false, note: 'Feeling stronger each day' },
    };
    setCalendarData(demoData);
  }, []);

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const days: (DayData | null)[] = [];
    
    // Add empty cells for days before the month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayDate = new Date(year, month, day);
      const isFuture = dayDate > today;
      
      let dayData = calendarData[dateKey] || { 
        date: day, 
        status: isFuture ? 'future' : 'empty'
      };
      
      // Override status if it's a future date
      if (isFuture) {
        dayData = { ...dayData, status: 'future' };
      }
      
      days.push(dayData);
    }

    return days;
  };

  const handleDayPress = (dayData: DayData | null) => {
    if (!dayData || dayData.status === 'future') return;
    
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayData.date).padStart(2, '0')}`;
    
    // Navigate to check-in screen for this date
    if (onNavigateToCheckIn) {
      onNavigateToCheckIn(dateKey);
    } else {
      // Fallback to old modal behavior
      setSelectedDay(dayData);
      setDayNote(dayData.note || '');
      setFappedToday(dayData.fapped ?? null);
      setShowDayModal(true);
    }
  };

  const handleSaveEntry = () => {
    if (selectedDay && fappedToday !== null) {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay.date).padStart(2, '0')}`;
      
      const newStatus = fappedToday ? 'relapse' : 'success';
      
      setCalendarData(prev => ({
        ...prev,
        [dateKey]: { 
          ...selectedDay, 
          note: dayNote,
          fapped: fappedToday,
          status: newStatus
        }
      }));
    }
    setShowDayModal(false);
    setFappedToday(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return '';
      case 'relapse':
        return '';
      default:
        return '';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return '#228b22';
      case 'relapse':
        return '#8b0000';
      default:
        return 'transparent';
    }
  };

  const currentStreak = 21; // Demo data
  const longestStreak = 45; // Demo data
  const totalRelapses = 3; // Demo data

  return (
    <LinearGradient
      colors={['#3c2415', '#5d4037', '#8d6e63']}
      style={styles.container}
    >
      <View style={styles.parchmentOverlay}>
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Banner */}
          <View style={styles.headerBanner}>
            <LinearGradient
              colors={['#3c2415', '#5d4037', '#3c2415']}
              style={styles.bannerGradient}
            >
              <TouchableOpacity style={styles.backButton} onPress={onBack}>
                <Text style={styles.backText}>←</Text>
              </TouchableOpacity>
              <View style={styles.headerContent}>
                <Text style={styles.headerTitle}>Your Journey Calendar</Text>
                <Text style={styles.todayDate}>
                  Today: {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </Text>
              </View>
            </LinearGradient>
          </View>

          {/* Month Navigation */}
          <View style={styles.monthNavigation}>
            <TouchableOpacity onPress={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}>
              <Text style={styles.navButton}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.monthTitle}>
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </Text>
            <TouchableOpacity onPress={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}>
              <Text style={styles.navButton}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Calendar Grid */}
          <View style={styles.calendarContainer}>
            {/* Day Headers */}
            <View style={styles.dayHeaders}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <Text key={day} style={styles.dayHeader}>{day}</Text>
              ))}
            </View>

            {/* Calendar Days */}
            <View style={styles.calendarGrid}>
              {getDaysInMonth().map((dayData, index) => {
                const isFuture = dayData && dayData.status === 'future';
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.daySquare,
                      dayData && styles.daySquareActive,
                      dayData?.status === 'success' && styles.successDay,
                      dayData?.status === 'relapse' && styles.relapseDay,
                      isFuture && styles.futureDay,
                    ]}
                    onPress={() => handleDayPress(dayData)}
                    disabled={isFuture || !dayData}
                  >
                    {dayData && (
                      <>
                        {/* Day Number */}
                        <Text style={[
                          styles.dayNumber,
                          dayData.status === 'success' && styles.successText,
                          dayData.status === 'relapse' && styles.relapseText,
                          isFuture && styles.futureText,
                        ]}>
                          {dayData.date}
                        </Text>
                        
                        {/* Beautiful Status Indicator */}
                        {dayData.status === 'success' && (
                          <View style={styles.successIndicator}>
                            <View style={styles.successDot} />
                          </View>
                        )}
                        
                        {dayData.status === 'relapse' && (
                          <View style={styles.relapseIndicator}>
                            <View style={styles.relapseDot} />
                          </View>
                        )}
                        
                        {/* Journal Entry Indicator - Only show if there's a note AND status is not empty */}
                        {dayData.note && dayData.status !== 'empty' && (
                          <View style={styles.journalIndicator} />
                        )}
                      </>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Progress Summary Bar */}
          <View style={styles.progressSummary}>
            <LinearGradient
              colors={['#3c2415', '#5d4037', '#3c2415']}
              style={styles.progressGradient}
            >
              <View style={styles.statItem}>
                <Text style={styles.statIcon}>🔥</Text>
                <Text style={styles.statLabel}>Current Streak</Text>
                <Text style={styles.statValue}>{currentStreak}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statIcon}>👑</Text>
                <Text style={styles.statLabel}>Longest Streak</Text>
                <Text style={styles.statValue}>{longestStreak}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statIcon}>⛓️‍💥</Text>
                <Text style={styles.statLabel}>Total Relapses</Text>
                <Text style={styles.statValue}>{totalRelapses}</Text>
              </View>
            </LinearGradient>
          </View>

          {/* Monthly Quote */}
          <View style={styles.quoteScroll}>
            <View style={styles.parchmentScroll}>
              <Text style={styles.quoteText}>
                "{monthlyQuotes[currentMonth.getMonth() % monthlyQuotes.length]}"
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Day Entry Modal */}
        <Modal
          visible={showDayModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowDayModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <LinearGradient
                colors={['#faf0e6', '#f5f5dc']}
                style={styles.modalGradient}
              >
                <Text style={styles.modalTitle}>
                  Day {selectedDay?.date}
                </Text>
                
                {/* Main Question */}
                <Text style={styles.mainQuestion}>Did you Fap Today?</Text>
                
                {/* Yes/No Options */}
                <View style={styles.optionsContainer}>
                  <TouchableOpacity 
                    style={[
                      styles.optionButton,
                      styles.noButton,
                      fappedToday === false && styles.selectedOption
                    ]}
                    onPress={() => setFappedToday(false)}
                  >
                    <Text style={[
                      styles.optionText,
                      styles.noText,
                      fappedToday === false && styles.selectedText
                    ]}>No</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[
                      styles.optionButton,
                      styles.yesButton,
                      fappedToday === true && styles.selectedOption
                    ]}
                    onPress={() => setFappedToday(true)}
                  >
                    <Text style={[
                      styles.optionText,
                      styles.yesText,
                      fappedToday === true && styles.selectedText
                    ]}>Yes</Text>
                  </TouchableOpacity>
                </View>

                {/* Journal Section */}
                {fappedToday !== null && (
                  <>
                    <Text style={styles.journalLabel}>What do you wanna say about yourself?</Text>
                    <TextInput
                      style={styles.noteInput}
                      value={dayNote}
                      onChangeText={setDayNote}
                      placeholder="Share your thoughts and feelings..."
                      multiline
                      textAlignVertical="top"
                    />
                  </>
                )}

                <View style={styles.modalButtons}>
                  <TouchableOpacity 
                    style={styles.cancelButton} 
                    onPress={() => {
                      setShowDayModal(false);
                      setFappedToday(null);
                    }}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[
                      styles.saveButton,
                      fappedToday === null && styles.disabledButton
                    ]} 
                    onPress={handleSaveEntry}
                    disabled={fappedToday === null}
                  >
                    <LinearGradient
                      colors={fappedToday === null ? ['#cccccc', '#999999'] : ['#d4af37', '#b8860b']}
                      style={styles.saveGradient}
                    >
                      <Text style={styles.saveText}>Save</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          </View>
        </Modal>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  parchmentOverlay: {
    flex: 1,
    backgroundColor: 'rgba(245, 245, 220, 0.15)',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  
  // Header Styles
  headerBanner: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 30,
  },
  bannerGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  backText: {
    fontSize: 24,
    color: '#d4af37',
    fontWeight: 'bold',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'serif',
    color: '#d4af37',
    fontWeight: '600',
    letterSpacing: 1.5,
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  todayDate: {
    fontSize: 12,
    fontFamily: 'serif',
    color: '#f5f5dc',
    fontStyle: 'italic',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  
  // Month Navigation
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  navButton: {
    fontSize: 28,
    color: '#d4af37',
    fontWeight: 'bold',
    padding: 10,
  },
  monthTitle: {
    fontSize: 20,
    fontFamily: 'serif',
    color: '#f5f5dc',
    fontWeight: '600',
    letterSpacing: 1,
  },
  
  // Calendar Styles
  calendarContainer: {
    backgroundColor: 'rgba(245, 245, 220, 0.9)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
    borderWidth: 2,
    borderColor: '#cd7f32',
    shadowColor: '#3c2415',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  dayHeaders: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  dayHeader: {
    width: daySize,
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'serif',
    color: '#8b4513',
    fontWeight: '600',
    paddingVertical: 8,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  daySquare: {
    width: daySize,
    height: daySize,
    borderWidth: 1,
    borderColor: 'rgba(222, 184, 135, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: 'transparent',
  },
  daySquareActive: {
    backgroundColor: '#faf0e6',
    borderColor: '#deb887',
  },
  successDay: {
    backgroundColor: 'rgba(34, 139, 34, 0.1)',
    borderColor: '#228b22',
    borderWidth: 2,
    shadowColor: '#228b22',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  relapseDay: {
    backgroundColor: 'rgba(139, 0, 0, 0.1)',
    borderColor: '#8b0000',
    borderWidth: 2,
    shadowColor: '#8b0000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  futureDay: {
    backgroundColor: 'rgba(245, 245, 220, 0.1)',
    borderColor: '#cccccc',
    borderWidth: 1,
    opacity: 0.4,
  },
  dayNumber: {
    fontSize: 16,
    fontFamily: 'serif',
    color: '#3c2415',
    fontWeight: '600',
  },
  successText: {
    color: '#228b22',
    fontWeight: 'bold',
  },
  relapseText: {
    color: '#8b0000',
    fontWeight: 'bold',
  },
  futureText: {
    color: '#999999',
  },
  
  // Beautiful Status Indicators
  successIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
  },
  successDot: {
    width: 8,
    height: 8,
    backgroundColor: '#228b22',
    borderRadius: 4,
    shadowColor: '#228b22',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  },
  relapseIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
  },
  relapseDot: {
    width: 8,
    height: 8,
    backgroundColor: '#8b0000',
    borderRadius: 4,
    shadowColor: '#8b0000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  },
  journalIndicator: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 4,
    height: 4,
    backgroundColor: '#d4af37',
    borderRadius: 2,
  },
  
  // Progress Summary
  progressSummary: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 30,
  },
  progressGradient: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'serif',
    color: '#d4af37',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'serif',
    color: '#f5f5dc',
    fontWeight: 'bold',
  },
  
  // Quote Section
  quoteScroll: {
    alignItems: 'center',
  },
  parchmentScroll: {
    backgroundColor: '#faf0e6',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#deb887',
    shadowColor: '#3c2415',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    marginHorizontal: 20,
  },
  quoteText: {
    fontSize: 16,
    fontFamily: 'serif',
    color: '#3c2415',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 24,
    letterSpacing: 0.5,
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  modalGradient: {
    padding: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'serif',
    color: '#3c2415',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 1,
  },
  
  // New Modal Question Styles
  mainQuestion: {
    fontSize: 20,
    fontFamily: 'serif',
    color: '#3c2415',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: 0.5,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 16,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  noButton: {
    backgroundColor: 'rgba(34, 139, 34, 0.1)',
    borderColor: '#228b22',
  },
  yesButton: {
    backgroundColor: 'rgba(139, 0, 0, 0.1)',
    borderColor: '#8b0000',
  },
  selectedOption: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    borderColor: '#d4af37',
    borderWidth: 3,
  },
  optionText: {
    fontSize: 18,
    fontFamily: 'serif',
    fontWeight: 'bold',
  },
  noText: {
    color: '#228b22',
  },
  yesText: {
    color: '#8b0000',
  },
  selectedText: {
    color: '#d4af37',
  },
  journalLabel: {
    fontSize: 16,
    fontFamily: 'serif',
    color: '#3c2415',
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  statusSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'center',
  },
  statusLabel: {
    fontSize: 16,
    fontFamily: 'serif',
    color: '#5d4037',
    fontWeight: '600',
    marginRight: 8,
  },
  statusValue: {
    fontSize: 16,
    fontFamily: 'serif',
    fontWeight: 'bold',
  },
  noteLabel: {
    fontSize: 16,
    fontFamily: 'serif',
    color: '#3c2415',
    fontWeight: '600',
    marginBottom: 8,
  },
  noteInput: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'serif',
    color: '#3c2415',
    borderWidth: 2,
    borderColor: '#deb887',
    minHeight: 100,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#8b4513',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontFamily: 'serif',
    color: '#8b4513',
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  saveGradient: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  saveText: {
    fontSize: 16,
    fontFamily: 'serif',
    color: '#ffffff',
    fontWeight: 'bold',
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
});