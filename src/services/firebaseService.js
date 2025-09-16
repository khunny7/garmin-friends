import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  limit,
  Timestamp,
  increment
} from 'firebase/firestore';
import { db } from '../firebase';

// FAQ Service
export const faqService = {
  // Get all active FAQs
  async getAll() {
    try {
      // Temporary: Use simple query without orderBy to avoid index requirement
      // TODO: Create composite index and restore orderBy('id', 'asc')
      const q = query(
        collection(db, 'faqs'),
        where('isActive', '==', true)
      );
      const snapshot = await getDocs(q);
      const faqs = snapshot.docs.map(doc => ({
        docId: doc.id,
        ...doc.data()
      }));
      
      // Sort in JavaScript as temporary workaround
      return faqs.sort((a, b) => (a.id || 0) - (b.id || 0));
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      throw error;
    }
  },

  // Get FAQs by category
  async getByCategory(category) {
    try {
      // Temporary: Use simple query without orderBy to avoid index requirement
      // TODO: Create composite index and restore orderBy('id', 'asc')
      const q = query(
        collection(db, 'faqs'),
        where('category', '==', category),
        where('isActive', '==', true)
      );
      const snapshot = await getDocs(q);
      const faqs = snapshot.docs.map(doc => ({
        docId: doc.id,
        ...doc.data()
      }));
      
      // Sort in JavaScript as temporary workaround
      return faqs.sort((a, b) => (a.id || 0) - (b.id || 0));
    } catch (error) {
      console.error('Error fetching FAQs by category:', error);
      throw error;
    }
  },

  // Admin: Create new FAQ
  async create(faqData, userUid) {
    try {
      const newFaq = {
        ...faqData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        createdBy: userUid,
        isActive: true
      };
      const docRef = await addDoc(collection(db, 'faqs'), newFaq);
      return docRef.id;
    } catch (error) {
      console.error('Error creating FAQ:', error);
      throw error;
    }
  },

  // Admin: Update FAQ
  async update(docId, updates, userUid) {
    try {
      const updateData = {
        ...updates,
        updatedAt: Timestamp.now(),
        updatedBy: userUid
      };
      await updateDoc(doc(db, 'faqs', docId), updateData);
    } catch (error) {
      console.error('Error updating FAQ:', error);
      throw error;
    }
  },

  // Admin: Delete FAQ (soft delete)
  async delete(docId) {
    try {
      await updateDoc(doc(db, 'faqs', docId), {
        isActive: false,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      throw error;
    }
  },

  // Admin: Convert QNA to FAQ
  async convertFromQNA(questionData, selectedAnswer, adminUser) {
    try {
      // Create FAQ from QNA question and selected answer
      const faqData = {
        question: questionData.title,
        answer: selectedAnswer ? selectedAnswer.content : questionData.question,
        category: questionData.category,
        tags: questionData.tags || [],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        createdBy: adminUser.uid,
        isActive: true,
        convertedFrom: {
          qnaId: questionData.docId,
          originalAuthor: questionData.authorName,
          originalQuestion: questionData.question,
          selectedAnswerId: selectedAnswer?.id,
          selectedAnswerAuthor: selectedAnswer?.authorName,
          convertedAt: Timestamp.now(),
          convertedBy: adminUser.uid
        }
      };

      const docRef = await addDoc(collection(db, 'faqs'), faqData);
      return docRef.id;
    } catch (error) {
      console.error('Error converting QNA to FAQ:', error);
      throw error;
    }
  }
};

// QNA Service
export const qnaService = {
  // Get all active questions
  async getQuestions(categoryFilter = null, limitCount = 50) {
    try {
      let q;
      if (categoryFilter && categoryFilter !== 'all') {
        // Temporary: Use simple query without orderBy to avoid index requirement
        q = query(
          collection(db, 'qna'),
          where('category', '==', categoryFilter),
          where('isActive', '==', true),
          limit(limitCount)
        );
      } else {
        // Temporary: Use simple query without orderBy to avoid index requirement
        q = query(
          collection(db, 'qna'),
          where('isActive', '==', true),
          limit(limitCount)
        );
      }
      
      const snapshot = await getDocs(q);
      const questions = snapshot.docs.map(doc => ({
        docId: doc.id,
        ...doc.data(),
        // Ensure answers array is always present
        answers: doc.data().answers || [],
        likes: doc.data().likes || 0,
        answerCount: doc.data().answerCount || doc.data().answers?.length || 0
      }));
      
      // Load answers for each question from subcollection
      for (const question of questions) {
        try {
          const answersQuery = query(
            collection(db, 'qna', question.docId, 'answers'),
            where('isActive', '==', true)
          );
          const answersSnapshot = await getDocs(answersQuery);
          question.answers = answersSnapshot.docs.map(answerDoc => ({
            id: answerDoc.id,
            ...answerDoc.data()
          }));
          question.answerCount = question.answers.length;
        } catch (error) {
          console.warn(`Error loading answers for question ${question.docId}:`, error);
          question.answers = [];
          question.answerCount = 0;
        }
      }
      
      // Sort in JavaScript as temporary workaround
      return questions.sort((a, b) => {
        const aTime = a.createdAt?.toDate?.() || new Date(0);
        const bTime = b.createdAt?.toDate?.() || new Date(0);
        return bTime - aTime; // desc order
      });
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  },

  // Get single question with answers
  async getQuestion(questionId) {
    try {
      const questionDoc = await getDoc(doc(db, 'qna', questionId));
      if (!questionDoc.exists()) {
        throw new Error('Question not found');
      }

      const question = {
        docId: questionDoc.id,
        ...questionDoc.data()
      };

      // Get answers - temporary fix without orderBy
      const answersQuery = query(
        collection(db, 'qna', questionId, 'answers'),
        where('isActive', '==', true)
      );
      const answersSnapshot = await getDocs(answersQuery);
      const answers = answersSnapshot.docs.map(doc => ({
        docId: doc.id,
        ...doc.data()
      }));
      
      // Sort in JavaScript as temporary workaround
      question.answers = answers.sort((a, b) => {
        const aTime = a.createdAt?.toDate?.() || new Date(0);
        const bTime = b.createdAt?.toDate?.() || new Date(0);
        return aTime - bTime; // asc order
      });

      return question;
    } catch (error) {
      console.error('Error fetching question:', error);
      throw error;
    }
  },

  // Create new question
  async createQuestion(questionData, user) {
    try {
      const newQuestion = {
        ...questionData,
        author: user.uid,
        authorName: user.displayName,
        authorPhoto: user.photoURL,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        likes: 0,
        likedBy: [],
        answers: [],
        isActive: true,
        answerCount: 0
      };
      
      const docRef = await addDoc(collection(db, 'qna'), newQuestion);
      return docRef.id;
    } catch (error) {
      console.error('Error creating question:', error);
      throw error;
    }
  },

  // Create new answer
  async createAnswer(questionId, answerData, user) {
    try {
      const newAnswer = {
        ...answerData,
        author: user.uid,
        authorName: user.displayName,
        authorPhoto: user.photoURL,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        likes: 0,
        likedBy: [],
        isActive: true
      };
      
      // Add answer to subcollection
      const answerRef = await addDoc(
        collection(db, 'qna', questionId, 'answers'), 
        newAnswer
      );

      // Increment answer count on question
      await updateDoc(doc(db, 'qna', questionId), {
        answerCount: increment(1),
        updatedAt: Timestamp.now()
      });

      return answerRef.id;
    } catch (error) {
      console.error('Error creating answer:', error);
      throw error;
    }
  },

  // Like/unlike question
  async toggleLikeQuestion(questionId, userUid) {
    try {
      const questionRef = doc(db, 'qna', questionId);
      const questionDoc = await getDoc(questionRef);
      
      if (!questionDoc.exists()) {
        throw new Error('Question not found');
      }

      const data = questionDoc.data();
      const likedBy = data.likedBy || [];
      const hasLiked = likedBy.includes(userUid);

      if (hasLiked) {
        // Unlike
        await updateDoc(questionRef, {
          likes: increment(-1),
          likedBy: likedBy.filter(uid => uid !== userUid)
        });
      } else {
        // Like
        await updateDoc(questionRef, {
          likes: increment(1),
          likedBy: [...likedBy, userUid]
        });
      }
    } catch (error) {
      console.error('Error toggling like on question:', error);
      throw error;
    }
  },

  // Like/unlike answer
  async toggleLikeAnswer(questionId, answerId, userUid) {
    try {
      const answerRef = doc(db, 'qna', questionId, 'answers', answerId);
      const answerDoc = await getDoc(answerRef);
      
      if (!answerDoc.exists()) {
        throw new Error('Answer not found');
      }

      const data = answerDoc.data();
      const likedBy = data.likedBy || [];
      const hasLiked = likedBy.includes(userUid);

      if (hasLiked) {
        // Unlike
        await updateDoc(answerRef, {
          likes: increment(-1),
          likedBy: likedBy.filter(uid => uid !== userUid)
        });
      } else {
        // Like
        await updateDoc(answerRef, {
          likes: increment(1),
          likedBy: [...likedBy, userUid]
        });
      }
    } catch (error) {
      console.error('Error toggling like on answer:', error);
      throw error;
    }
  },

  // Delete question (soft delete - only author or admin)
  async deleteQuestion(questionId, userUid, isAdmin = false) {
    try {
      const questionRef = doc(db, 'qna', questionId);
      const questionDoc = await getDoc(questionRef);
      
      if (!questionDoc.exists()) {
        throw new Error('Question not found');
      }

      const questionData = questionDoc.data();
      
      // Check if user is author or admin
      if (questionData.author !== userUid && !isAdmin) {
        throw new Error('Not authorized to delete this question');
      }

      // Soft delete
      await updateDoc(questionRef, {
        isActive: false,
        deletedAt: Timestamp.now(),
        deletedBy: userUid
      });
    } catch (error) {
      console.error('Error deleting question:', error);
      throw error;
    }
  },

  // Delete answer (soft delete - only author or admin)
  async deleteAnswer(questionId, answerId, userUid, isAdmin = false) {
    try {
      const answerRef = doc(db, 'qna', questionId, 'answers', answerId);
      const answerDoc = await getDoc(answerRef);
      
      if (!answerDoc.exists()) {
        throw new Error('Answer not found');
      }

      const answerData = answerDoc.data();
      
      // Check if user is author or admin
      if (answerData.author !== userUid && !isAdmin) {
        throw new Error('Not authorized to delete this answer');
      }

      // Soft delete
      await updateDoc(answerRef, {
        isActive: false,
        deletedAt: Timestamp.now(),
        deletedBy: userUid
      });

      // Decrement answer count on question
      await updateDoc(doc(db, 'qna', questionId), {
        answerCount: increment(-1),
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error deleting answer:', error);
      throw error;
    }
  }
};

// User Service
export const userService = {
  // Get user profile
  async getProfile(uid) {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  // Admin: Get all users
  async getAllUsers() {
    try {
      // Temporary: Use simple query without orderBy to avoid index requirement
      const q = query(collection(db, 'users'));
      const snapshot = await getDocs(q);
      const users = snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      }));
      
      // Sort in JavaScript as temporary workaround
      return users.sort((a, b) => {
        const aTime = a.createdAt?.toDate?.() || new Date(0);
        const bTime = b.createdAt?.toDate?.() || new Date(0);
        return bTime - aTime; // desc order
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Admin: Update user admin status
  async updateAdminStatus(uid, isAdmin) {
    try {
      await updateDoc(doc(db, 'users', uid), {
        isAdmin: isAdmin,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating admin status:', error);
      throw error;
    }
  },

  // Update user profile
  async updateProfile(uid, profileData) {
    try {
      await updateDoc(doc(db, 'users', uid), {
        ...profileData,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }
};

// Friend Posts Service
export const friendPostsService = {
  // Get all active friend posts
  async getAll() {
    try {
      // Use simple query to avoid index requirement - filter expiration in JavaScript
      const q = query(
        collection(db, 'friendPosts'),
        where('isActive', '==', true)
      );
      const snapshot = await getDocs(q);
      const now = new Date();
      
      const posts = snapshot.docs
        .map(doc => ({
          docId: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          expiresAt: doc.data().expiresAt?.toDate()
        }))
        // Filter out expired posts in JavaScript
        .filter(post => post.expiresAt > now);

      // Sort by creation date (newest first)
      return posts.sort((a, b) => b.createdAt - a.createdAt);
    } catch (error) {
      console.error('Error fetching friend posts:', error);
      throw error;
    }
  },

  // Get next ID for friend post
  async getNextId() {
    try {
      const snapshot = await getDocs(collection(db, 'friendPosts'));
      const existingIds = snapshot.docs.map(doc => doc.data().id || 0);
      return existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
    } catch (error) {
      console.error('Error getting next ID:', error);
      return 1;
    }
  },

  // Create new friend post
  async create(postData, user) {
    try {
      const nextId = await this.getNextId();
      
      const friendPost = {
        id: nextId,
        name: postData.name,
        introduction: postData.introduction,
        garminProfileUrl: postData.garminProfileUrl,
        location: postData.location || '',
        activities: postData.activities || [],
        author: user.uid,
        authorName: user.displayName,
        authorPhoto: user.photoURL,
        createdAt: Timestamp.now(),
        expiresAt: Timestamp.fromDate(new Date(postData.expiresAt)),
        likes: 0,
        likedBy: [],
        isActive: true
      };

      const docRef = await addDoc(collection(db, 'friendPosts'), friendPost);
      
      return {
        docId: docRef.id,
        ...friendPost,
        createdAt: friendPost.createdAt.toDate(),
        expiresAt: friendPost.expiresAt.toDate()
      };
    } catch (error) {
      console.error('Error creating friend post:', error);
      throw error;
    }
  },

  // Update friend post
  async update(docId, updates) {
    try {
      await updateDoc(doc(db, 'friendPosts', docId), {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating friend post:', error);
      throw error;
    }
  },

  // Delete friend post (soft delete)
  async delete(docId) {
    try {
      await updateDoc(doc(db, 'friendPosts', docId), {
        isActive: false,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error deleting friend post:', error);
      throw error;
    }
  },

  // Like/unlike a friend post
  async toggleLike(docId, userId) {
    try {
      const postRef = doc(db, 'friendPosts', docId);
      const postDoc = await getDoc(postRef);
      
      if (!postDoc.exists()) {
        throw new Error('Post not found');
      }

      const currentLikedBy = postDoc.data().likedBy || [];
      const isLiked = currentLikedBy.includes(userId);

      if (isLiked) {
        // Unlike
        await updateDoc(postRef, {
          likes: increment(-1),
          likedBy: currentLikedBy.filter(id => id !== userId),
          updatedAt: Timestamp.now()
        });
      } else {
        // Like
        await updateDoc(postRef, {
          likes: increment(1),
          likedBy: [...currentLikedBy, userId],
          updatedAt: Timestamp.now()
        });
      }

      return !isLiked; // Return new like status
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  },

  // Clean up expired posts (admin function)
  async cleanupExpired() {
    try {
      const q = query(
        collection(db, 'friendPosts'),
        where('isActive', '==', true),
        where('expiresAt', '<=', Timestamp.now())
      );
      const snapshot = await getDocs(q);
      
      const updatePromises = snapshot.docs.map(docSnapshot => 
        updateDoc(doc(db, 'friendPosts', docSnapshot.id), {
          isActive: false,
          updatedAt: Timestamp.now()
        })
      );

      await Promise.all(updatePromises);
      return snapshot.docs.length; // Return number of cleaned up posts
    } catch (error) {
      console.error('Error cleaning up expired posts:', error);
      throw error;
    }
  }
};