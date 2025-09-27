import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

interface LeaderboardEntry {
  id: string;
  username: string | null;
  avatar_url: string | null;
  streak: number;
  rank: number;
}

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<number | null>(null);

  useEffect(() => {
    loadLeaderboardData();
  }, [user]);

  const loadLeaderboardData = async () => {
    try {
      setLoading(true);
      
      // For guest users, show sample data without user-specific information
      // For authenticated users, show sample data with user rank if applicable
      
      // Simulate API delay (shorter for guests)
      const delay = user ? 800 : 300;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Sample leaderboard data
      const sampleData: LeaderboardEntry[] = [
        { id: '1', username: 'WarriorOne', avatar_url: null, streak: 120, rank: 1 },
        { id: '2', username: 'DisciplineMaster', avatar_url: null, streak: 95, rank: 2 },
        { id: '3', username: 'PathFinder', avatar_url: null, streak: 87, rank: 3 },
        { id: '4', username: 'SacredSoul', avatar_url: null, streak: 76, rank: 4 },
        { id: '5', username: 'MindfulOne', avatar_url: null, streak: 68, rank: 5 },
        { id: '6', username: 'StrengthSeeker', avatar_url: null, streak: 59, rank: 6 },
        { id: '7', username: 'PurityPursuer', avatar_url: null, streak: 52, rank: 7 },
        { id: '8', username: 'NobleKnight', avatar_url: null, streak: 45, rank: 8 },
        { id: '9', username: 'VirtueGuardian', avatar_url: null, streak: 38, rank: 9 },
        { id: '10', username: 'WisdomWalker', avatar_url: null, streak: 31, rank: 10 },
      ];
      
      setLeaderboardData(sampleData);
      
      // For authenticated users, find their rank
      if (user) {
        const userEntry = sampleData.find(entry => entry.id === user.id);
        setUserRank(userEntry ? userEntry.rank : null);
      } else {
        // For guests, no user rank
        setUserRank(null);
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderLeaderboardItem = ({ item }: { item: LeaderboardEntry }) => {
    const isUser = user && item.id === user.id;
    
    return (
      <View style={[styles.leaderboardItem, isUser && styles.userItem]}>
        <View style={styles.rankContainer}>
          <Text style={styles.rankText}>{item.rank}</Text>
        </View>
        
        <View style={styles.avatarContainer}>
          {item.avatar_url ? (
            <Image source={{ uri: item.avatar_url }} style={styles.avatar} />
          ) : (
            <View style={styles.placeholderAvatar}>
              <Text style={styles.avatarText}>
                {item.username ? item.username.charAt(0).toUpperCase() : 'U'}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.userInfo}>
          <Text style={[styles.username, isUser && styles.currentUser]}>
            {item.username || 'Anonymous Warrior'}
          </Text>
        </View>
        
        <View style={styles.streakContainer}>
          <Text style={styles.streakCount}>{item.streak}</Text>
          <Text style={styles.streakLabel}>days</Text>
        </View>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={['#F5DEB3', '#DEB887', '#CD853F']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>🏆 Global Leaderboard</Text>
        <Text style={styles.subtitle}>Top Sacred Warriors Worldwide</Text>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#8B4513" />
            <Text style={styles.loadingText}>Loading sacred warriors...</Text>
          </View>
        ) : (
          <>
            {userRank && (
              <View style={styles.userRankContainer}>
                <Text style={styles.userRankText}>
                  Your Rank: <Text style={styles.userRankNumber}>#{userRank}</Text>
                </Text>
              </View>
            )}
            
            <FlatList
              data={leaderboardData}
              renderItem={renderLeaderboardItem}
              keyExtractor={(item) => item.id}
              style={styles.leaderboardList}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
            
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                {!user ? 'Sign up to join the leaderboard!' : 'Keep your streak alive to climb higher!'}
              </Text>
            </View>
          </>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontFamily: 'serif',
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'serif',
    color: '#A0522D',
    marginBottom: 24,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'serif',
    color: '#8B4513',
    marginTop: 16,
  },
  userRankContainer: {
    backgroundColor: 'rgba(218, 165, 32, 0.2)',
    borderRadius: 16,
    padding: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  userRankText: {
    fontSize: 18,
    fontFamily: 'serif',
    color: '#8B4513',
    fontWeight: '600',
  },
  userRankNumber: {
    color: '#DAA520',
    fontWeight: 'bold',
  },
  leaderboardList: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 245, 220, 0.9)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(218, 165, 32, 0.3)',
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userItem: {
    backgroundColor: 'rgba(218, 165, 32, 0.15)',
    borderWidth: 2,
    borderColor: '#DAA520',
  },
  rankContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DAA520',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  rankText: {
    fontSize: 18,
    fontFamily: 'serif',
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  placeholderAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#A0522D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontFamily: 'serif',
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontFamily: 'serif',
    color: '#8B4513',
    fontWeight: '600',
  },
  currentUser: {
    color: '#DAA520',
    fontWeight: 'bold',
  },
  streakContainer: {
    alignItems: 'center',
  },
  streakCount: {
    fontSize: 20,
    fontFamily: 'serif',
    color: '#DAA520',
    fontWeight: 'bold',
  },
  streakLabel: {
    fontSize: 12,
    fontFamily: 'serif',
    color: '#A0522D',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(139, 69, 19, 0.2)',
  },
  footerText: {
    fontSize: 16,
    fontFamily: 'serif',
    color: '#8B4513',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});