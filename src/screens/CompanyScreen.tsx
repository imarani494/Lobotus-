import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  FlatList,
  TextInput,
  StyleSheet,
  Text,
  RefreshControl,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ListRenderItemInfo,
} from 'react-native';
import { fetchClientList, normalizeArray } from '../services/api';
import type { ClientItem } from '../services/api';
import { ClientCard, LoadingView, ErrorView, EmptyView } from '../components';
import { COLORS, RADIUS, ITEMS_PER_PAGE } from '../config/constants';

const CompanyScreen: React.FC = () => {
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [filteredClients, setFilteredClients] = useState<ClientItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hasMore, setHasMore] = useState<boolean>(true);
  const offsetRef = useRef<number>(0);

  
  const loadClients = useCallback(
    async (reset = false): Promise<void> => {
      const currentOffset = reset ? 0 : offsetRef.current;

      if (reset) {
        setLoading(true);
        setError(null);
        offsetRef.current = 0;
      }

      const result = await fetchClientList({ offset: currentOffset });

      if (!result.success) {
        setError(result.error);
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
        return;
      }

      const items = normalizeArray<ClientItem>(result.data);

      if (reset) {
        setClients(items);
        applySearch(searchQuery, items);
      } else {
        setClients(prev => {
          const merged = [...prev, ...items];
          applySearch(searchQuery, merged);
          return merged;
        });
      }

      offsetRef.current = currentOffset + ITEMS_PER_PAGE;
      setHasMore(items.length >= ITEMS_PER_PAGE);
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    },
    [searchQuery],
  ); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadClients(true);
  }, []);

  const applySearch = (query: string, source: ClientItem[]): void => {
    if (!query.trim()) {
      setFilteredClients(source);
      return;
    }
    const q = query.toLowerCase();
    setFilteredClients(
      source.filter(
        c =>
          (c.client_name || c.name || '').toLowerCase().includes(q) ||
          (c.city || '').toLowerCase().includes(q) ||
          (c.client_code || '').toLowerCase().includes(q),
      ),
    );
  };

  const handleSearch = (text: string): void => {
    setSearchQuery(text);
    applySearch(text, clients);
  };

  const onRefresh = (): void => {
    setRefreshing(true);
    setSearchQuery('');
    loadClients(true);
  };

  const onEndReached = (): void => {
    if (!loadingMore && hasMore && !searchQuery) {
      setLoadingMore(true);
      loadClients(false);
    }
  };

  if (loading && clients.length === 0) {
    return <LoadingView message="Fetching clients..." />;
  }

  if (error && clients.length === 0) {
    return <ErrorView message={error} onRetry={() => loadClients(true)} />;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>
            Companies <Text style={styles.count}>({clients.length})</Text>
          </Text>
          <TouchableOpacity style={styles.nearbyBtn}>
            <Text style={styles.nearbyText}>📍 Near by Clients</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchWrapper}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, city, code..."
            placeholderTextColor="#9AA0A6"
            value={searchQuery}
            onChangeText={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => handleSearch('')}
              hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
            >
              <Text style={styles.clearBtn}>✕</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.filterBtn}>
            <Text style={{ fontSize: 18 }}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {searchQuery ? (
        <View style={styles.statsBar}>
          <Text style={styles.statsText}>
            Showing{' '}
            <Text style={styles.statsBold}>{filteredClients.length}</Text> of{' '}
            <Text style={styles.statsBold}>{clients.length}</Text> clients
          </Text>
        </View>
      ) : null}

      {/* List */}
      <FlatList<ClientItem>
        data={filteredClients}
        keyExtractor={(item: ClientItem, index: number) =>
          item.client_id?.toString() ?? index.toString()
        }
        renderItem={({ item }: ListRenderItemInfo<ClientItem>) => (
          <ClientCard client={item} />
        )}
        ListEmptyComponent={<EmptyView message="No clients found." />}
        ListFooterComponent={
          loadingMore ? <LoadingView message="Loading more..." /> : null
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        onEndReached={onEndReached}
        onEndReachedThreshold={0.4}
        contentContainerStyle={
          filteredClients.length === 0
            ? { flex: 1 }
            : { paddingVertical: 8, paddingBottom: 80 }
        }
        showsVerticalScrollIndicator={false}
      />

      {/* FAB */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.85}>
        <Text style={styles.fabIcon}>＋</Text>
        <Text style={styles.fabText}>Company</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },

  header: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.textPrimary },
  count: { fontSize: 16, fontWeight: '500', color: COLORS.textSecondary },
  nearbyBtn: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
  },
  nearbyText: { fontSize: 12, fontWeight: '700', color: COLORS.primary },

  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: RADIUS.sm,
    paddingHorizontal: 10,
    height: 42,
    gap: 6,
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, fontSize: 13, color: COLORS.textPrimary },
  clearBtn: { fontSize: 14, color: '#9AA0A6', padding: 2 },
  filterBtn: { paddingLeft: 4 },

  statsBar: { paddingHorizontal: 18, paddingVertical: 6 },
  statsText: { fontSize: 12, color: COLORS.textSecondary },
  statsBold: { fontWeight: '700', color: COLORS.textPrimary },

  fab: {
    position: 'absolute',
    right: 16,
    bottom: 20,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    elevation: 6,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  fabIcon: { fontSize: 18, color: '#fff', fontWeight: '700' },
  fabText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});

export default CompanyScreen;
