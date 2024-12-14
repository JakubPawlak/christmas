import { of } from 'rxjs';

export type MockUser = {
  name: string;
  data: { draw: string; isDrawn: boolean };
};

export function createMockAngularFirestore(users: MockUser[]) {
  return new MockAngularFirestore(users);
}

class MockAngularFirestore {
  constructor(public users: MockUser[]) {}

  collection(someString: string) {
    // return mocked collection here
    return new MockAngularFirestoreCollection(this.users);
  }
}

class MockAngularFirestoreCollection {
  constructor(public snapshotMock: any) {}

  snapshotChanges() {
    return of(createSnapshotMock(this.snapshotMock));
  }
  doc(name: string) {
    return {
      set(user: any) {},
    };
  }
}

function createSnapshotMock(users: MockUser[]) {
  return users.map((user) => ({
    payload: {
      doc: {
        id: user.name,
        data: () => user.data,
      },
    },
  }));
}
