import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  SafeAreaView,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();

const INITIAL_CATEGORIES = [
  'All', 'Breakfast', 'Lunch', 'Dinner', 'Desserts',
  'Salads', 'Soups', 'Vegan', 'Beverages', 'Snacks', 'My Food'
];

const INITIAL_RECIPES = [
  {
    id: '1',
    name: 'Pancake Stack',
    category: 'Breakfast',
    image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=500',
    ingredients: ['2 cups Flour', '2 Eggs', '1.5 cups Milk', '2 tbsp Butter'],
    instructions: '1. Mix dry ingredients.\n2. Whisk eggs and milk.\n3. Pour batter on griddle and flip when bubbly.',
    prepTime: '20 mins',
    servings: '4',
    calories: '350 kcal',
    difficulty: 'Easy',
    isFavorite: false,
    isUserCreated: false,
  },
  {
    id: '2',
    name: 'Grilled Chicken Salad',
    category: 'Salads',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500',
    ingredients: ['Chicken Breast', 'Lettuce', 'Tomatoes', 'Olive Oil'],
    instructions: '1. Grill chicken for 6-8 mins.\n2. Chop veggies.\n3. Toss with dressing.',
    prepTime: '25 mins',
    servings: '2',
    calories: '420 kcal',
    difficulty: 'Medium',
    isFavorite: true,
    isUserCreated: false,
  },
  {
    id: '3',
    name: 'Avocado Toast',
    category: 'Breakfast',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500',
    ingredients: ['2 slices Sourdough', '1 ripe Avocado', 'Salt', 'Chili Flakes'],
    instructions: '1. Toast sourdough slices.\n2. Mash avocado with salt.\n3. Spread over toast and top with chili flakes.',
    prepTime: '10 mins',
    servings: '1',
    calories: '280 kcal',
    difficulty: 'Easy',
    isFavorite: false,
    isUserCreated: false,
  },
  {
    id: '4',
    name: 'Creamy Tomato Basil Soup',
    category: 'Soups',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500',
    ingredients: ['4 fresh Tomatoes', '1 cup Heavy Cream', 'Fresh Basil leaves', '2 Garlic cloves'],
    instructions: '1. Saute garlic.\n2. Simmer roasted tomatoes.\n3. Puree with cream and basil.',
    prepTime: '30 mins',
    servings: '3',
    calories: '240 kcal',
    difficulty: 'Medium',
    isFavorite: false,
    isUserCreated: false,
  }
];

function HomeScreen({ navigation, recipes, setRecipes, selectedCategory, setSelectedCategory }) {
  const toggleFavorite = (id) => {
    setRecipes((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item))
    );
  };

  const filteredRecipes = recipes.filter((recipe) => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'My Food') return recipe.isUserCreated;
    return recipe.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Horizontal Category Bar */}
      <View style={styles.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {INITIAL_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryChip, selectedCategory === cat && styles.activeCategoryChip]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.categoryText, selectedCategory === cat && styles.activeCategoryText]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Action Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.navActionButton}
          onPress={() => navigation.navigate('Favorites')}
        >
          <Ionicons name="heart" size={18} color="#FF5252" />
          <Text style={styles.navButtonText}>Favorites</Text>
        </TouchableOpacity>

        {selectedCategory === 'My Food' && (
          <TouchableOpacity
            style={[styles.navActionButton, styles.addRecipeButton]}
            onPress={() => navigation.navigate('AddRecipe')}
          >
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={[styles.navButtonText, { color: '#fff' }]}>Add New Recipe</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Main Recipe List */}
      <FlatList
        data={filteredRecipes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.recipeList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No recipes available in this view.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('RecipeDetails', { recipeId: item.id })}
          >
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
                  <Ionicons
                    name={item.isFavorite ? 'heart' : 'heart-outline'}
                    size={24}
                    color="#FF5252"
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.cardMeta}>{item.prepTime} • {item.difficulty}</Text>

              {item.isUserCreated && (
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() => navigation.navigate('AddRecipe', { editRecipe: item })}
                  >
                    <Text style={styles.btnText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => {
                      Alert.alert('Delete Recipe', 'Are you sure?', [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Delete',
                          style: 'destructive',
                          onPress: () => setRecipes((prev) => prev.filter((r) => r.id !== item.id)),
                        },
                      ]);
                    }}
                  >
                    <Text style={styles.btnText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

function RecipeDetailsScreen({ route, navigation, recipes, setRecipes }) {
  const { recipeId } = route.params;
  const recipe = recipes.find((r) => r.id === recipeId);

  if (!recipe) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.emptyText}>Recipe not found.</Text>
      </SafeAreaView>
    );
  }

  const toggleFavorite = () => {
    setRecipes((prev) =>
      prev.map((item) => (item.id === recipe.id ? { ...item, isFavorite: !item.isFavorite } : item))
    );
  };

  return (
    <ScrollView style={styles.detailsContainer}>
      <Image source={{ uri: recipe.image }} style={styles.detailsImage} />
      <View style={styles.detailsBody}>
        <View style={styles.cardHeader}>
          <Text style={styles.detailsTitle}>{recipe.name}</Text>
          <TouchableOpacity onPress={toggleFavorite}>
            <Ionicons name={recipe.isFavorite ? 'heart' : 'heart-outline'} size={28} color="#FF5252" />
          </TouchableOpacity>
        </View>

        {/* Recipe Metadata */}
        <View style={styles.metaRow}>
          <Text style={styles.metaBadge}>Time: {recipe.prepTime}</Text>
          <Text style={styles.metaBadge}>Servings: {recipe.servings}</Text>
          <Text style={styles.metaBadge}>Calories: {recipe.calories}</Text>
          <Text style={styles.metaBadge}>Level: {recipe.difficulty}</Text>
        </View>

        {/* Ingredients */}
        <Text style={styles.sectionHeading}>Ingredients</Text>
        {recipe.ingredients.map((ing, i) => (
          <Text key={i} style={styles.itemText}>• {ing}</Text>
        ))}

        {/* Instructions */}
        <Text style={styles.sectionHeading}>Instructions</Text>
        <Text style={styles.itemText}>{recipe.instructions}</Text>
      </View>
    </ScrollView>
  );
}

function FavoritesScreen({ navigation, recipes }) {
  const favorites = recipes.filter((r) => r.isFavorite);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.recipeList}
        ListEmptyComponent={<Text style={styles.emptyText}>No favorites added yet.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('RecipeDetails', { recipeId: item.id })}
          >
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardMeta}>{item.prepTime} • {item.difficulty}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

function AddRecipeScreen({ route, navigation, setRecipes }) {
  const editRecipe = route.params?.editRecipe;

  const [name, setName] = useState(editRecipe?.name || '');
  const [image, setImage] = useState(editRecipe?.image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500');
  const [ingredients, setIngredients] = useState(editRecipe?.ingredients.join('\n') || '');
  const [instructions, setInstructions] = useState(editRecipe?.instructions || '');

  const handleSave = () => {
    if (!name || !instructions || !ingredients) {
      Alert.alert('Validation', 'Please fill out all required fields.');
      return;
    }

    if (editRecipe) {
      setRecipes((prev) =>
        prev.map((r) =>
          r.id === editRecipe.id
            ? {
                ...r,
                name,
                image,
                ingredients: ingredients.split('\n').filter((i) => i.trim() !== ''),
                instructions,
              }
            : r
        )
      );
    } else {
      const newRecipe = {
        id: Date.now().toString(),
        name,
        category: 'My Food',
        image,
        ingredients: ingredients.split('\n').filter((i) => i.trim() !== ''),
        instructions,
        prepTime: '20 mins',
        servings: '2',
        calories: '300 kcal',
        difficulty: 'Easy',
        isFavorite: false,
        isUserCreated: true,
      };
      setRecipes((prev) => [newRecipe, ...prev]);
    }
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.formContainer}>
      <Text style={styles.label}>Recipe Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="e.g. Avocado Salad" />

      <Text style={styles.label}>Image URL</Text>
      <TextInput style={styles.input} value={image} onChangeText={setImage} placeholder="Image URL link" />

      <Text style={styles.label}>Ingredients (one per line)</Text>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        value={ingredients}
        onChangeText={setIngredients}
        multiline
        placeholder="Ingredient 1&#10;Ingredient 2"
      />

      <Text style={styles.label}>Step-by-Step Instructions</Text>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        value={instructions}
        onChangeText={setInstructions}
        multiline
        placeholder="1. Prepare bowl&#10;2. Mix well"
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Recipe</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

export default function App() {
  const [recipes, setRecipes] = useState(INITIAL_RECIPES);
  const [selectedCategory, setSelectedCategory] = useState('All');

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Foodie"
        screenOptions={{
          headerStyle: { backgroundColor: '#FF6B6B' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="Foodie">
          {(props) => (
            <HomeScreen
              {...props}
              recipes={recipes}
              setRecipes={setRecipes}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="RecipeDetails" options={{ title: 'Recipe Details' }}>
          {(props) => <RecipeDetailsScreen {...props} recipes={recipes} setRecipes={setRecipes} />}
        </Stack.Screen>
        <Stack.Screen name="Favorites" options={{ title: 'My Favorites' }}>
          {(props) => <FavoritesScreen {...props} recipes={recipes} />}
        </Stack.Screen>
        <Stack.Screen name="AddRecipe" options={{ title: 'Recipe Editor' }}>
          {(props) => <AddRecipeScreen {...props} setRecipes={setRecipes} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  categoryContainer: { backgroundColor: '#fff', paddingVertical: 10 },
  categoryScroll: { paddingHorizontal: 12 },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#eee',
    marginRight: 8,
  },
  activeCategoryChip: { backgroundColor: '#FF6B6B' },
  categoryText: { color: '#444', fontWeight: '500' },
  activeCategoryText: { color: '#fff', fontWeight: 'bold' },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  navActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  addRecipeButton: { backgroundColor: '#28a745', borderColor: '#28a745' },
  navButtonText: { marginLeft: 6, fontWeight: '600', color: '#333' },
  recipeList: { padding: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
  },
  cardImage: { width: '100%', height: 160 },
  cardContent: { padding: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  cardMeta: { color: '#666', marginTop: 4 },
  actionRow: { flexDirection: 'row', marginTop: 10, gap: 10 },
  editBtn: { backgroundColor: '#007bff', paddingVertical: 4, paddingHorizontal: 12, borderRadius: 6 },
  deleteBtn: { backgroundColor: '#dc3545', paddingVertical: 4, paddingHorizontal: 12, borderRadius: 6 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  emptyContainer: { alignItems: 'center', marginTop: 40 },
  emptyText: { textAlign: 'center', color: '#888', marginTop: 20 },
  detailsContainer: { flex: 1, backgroundColor: '#fff' },
  detailsImage: { width: '100%', height: 240 },
  detailsBody: { padding: 16 },
  detailsTitle: { fontSize: 24, fontWeight: 'bold', color: '#222', flex: 1 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 12 },
  metaBadge: {
    backgroundColor: '#f1f1f1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 12,
    color: '#555',
  },
  sectionHeading: { fontSize: 18, fontWeight: 'bold', marginTop: 16, marginBottom: 8, color: '#333' },
  itemText: { fontSize: 14, color: '#555', lineHeight: 22 },
  formContainer: { flex: 1, padding: 16, backgroundColor: '#fff' },
  label: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 14, fontSize: 14 },
  multilineInput: { height: 90, textAlignVertical: 'top' },
  saveButton: { backgroundColor: '#FF6B6B', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
