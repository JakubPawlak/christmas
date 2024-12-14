import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { EMPTY, of } from 'rxjs';
import { ListService } from '../services/list.service';
import { UserService } from '../services/user.service';
import {
  createMockAngularFirestore,
  MockUser
} from '../__testing__/firestore.mock';
import { screen } from '@testing-library/angular';
import { LotteryComponent } from './lottery.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('LotteryComponent', () => {
  describe('submit', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    describe('integration tests', () => {
      test('checks if input user exists', () => {
        const { component, listService } = setupTestingModule();
        const spyUserExist = jest.spyOn(listService, 'userExist');

        component.submit();

        expect(spyUserExist).toHaveBeenCalledWith(drawingUserName);
      });

      test('updates user after drawn', () => {
        const { component, listService } = setupTestingModule();

        component.submit();

        expect(listService.updateUser).toHaveBeenCalledWith(
          drawingUserName,
          userToDrawName
        );
        expect(component.drawn).toEqual(userToDrawName);
      });

      test('draws user if other users are already drawn', () => {
        const { component, listService } = setupTestingModule([
          ...defaultMockUsers,
          { name: 'adam', data: { draw: '', isDrawn: true } }
        ]);

        component.submit();

        expect(listService.updateUser).toHaveBeenCalledWith(
          drawingUserName,
          userToDrawName
        );
      });

      test('draws always user without draw if only two users left to prevent being left without possible draw', () => {
        const { component, listService } = setupTestingModule([
          { name: 'aleksander', data: { draw: '', isDrawn: true } },
          { name: 'adam', data: { draw: '', isDrawn: false } },
          {
            name: 'janina',
            data: { draw: 'aleksander', isDrawn: false }
          }
        ]);

        component.submit();

        expect(listService.updateUser).toHaveBeenCalledWith(
          'aleksander',
          'adam'
        );

        component.userName = 'adam';

        component.submit();

        expect(listService.updateUser).toHaveBeenCalledWith('adam', 'janina');
      });

      test('alerts if user has already drawn', () => {
        const alertSpy = jest
          .spyOn(window, 'alert')
          .mockImplementation(() => {});
        const { component } = setupTestingModule([
          ...defaultMockUsers,
          {
            name: drawingUserName,
            data: { draw: userToDrawName, isDrawn: true }
          }
        ]);

        component.submit();

        expect(alertSpy).toHaveBeenCalledWith('Masz już swój los');
      });

      test('alerts if user does not exist', () => {
        const alertSpy = jest
          .spyOn(window, 'alert')
          .mockImplementation(() => {});
        const { component } = setupTestingModule();

        component.userName = 'Invalid user';

        component.submit();

        expect(alertSpy).toHaveBeenCalledWith(
          'Nie ma takiej osoby na liście. Sprawdź poprawność wpisanego imienia. Polskie litery mają znaczenie.'
        );
      });
    });

    describe('visual tests', () => {
      beforeEach(() => {
        jest.useFakeTimers();
      });

      afterEach(() => {
        jest.useRealTimers();
      });

      test('displays title', () => {
        setupVisualTestingModule();

        expect(
          screen.getByText('Zostań świętym Mikołajem')
        ).toBeInTheDocument();
      });

      test('shows drawn user if only one user is left', () => {
        const { component, fixture } = setupVisualTestingModule();

        component.submit();

        jest.runAllTimers();

        fixture.detectChanges();

        expect(screen.getByTestId('drawName').textContent).toEqual(
          userToDrawName
        );
      });

      /********************************/

      test('draws user if other users are already drawn', () => {
        const { component, fixture } = setupVisualTestingModule([
          ...defaultMockUsers,
          { name: 'adam', data: { draw: '', isDrawn: true } }
        ]);

        component.submit();

        jest.runAllTimers();

        fixture.detectChanges();

        expect(screen.getByTestId('drawName').textContent).toEqual(
          userToDrawName
        );
      });

      // test('draws always user without draw if only two users left to prevent being left without possible draw', () => {
      //   const { component, fixture } = setupVisualTestingModule([
      //     { name: drawingUserName, data: { draw: '', isDrawn: true } },
      //     {
      //       name: userToDrawName,
      //       data: { draw: drawingUserName, isDrawn: false }
      //     },
      //     { name: 'adam', data: { draw: '', isDrawn: false } }
      //   ]);

      //   jest.runAllTimers();

      //   fixture.detectChanges();

      //   expect(screen.getByTestId('drawName').textContent).toEqual('adam');

      //   component.drawn = '';
      //   component.userName = 'adam';
      //   fixture.detectChanges();

      //   component.submit();

      //   jest.runAllTimers();

      //   fixture.detectChanges();

      //   expect(screen.getByTestId('drawName').textContent).toEqual(
      //     userToDrawName
      //   );
      // });

      // test('alerts if user has already drawn', () => {
      //   const alertSpy = jest
      //     .spyOn(window, 'alert')
      //     .mockImplementation(() => {});
      //   const { component } = setupTestingModule([
      //     ...defaultMockUsers,
      //     {
      //       name: drawingUserName,
      //       data: { draw: userToDrawName, isDrawn: true }
      //     }
      //   ]);

      //   component.submit();

      //   expect(alertSpy).toHaveBeenCalledWith('Masz już swój los');
      // });

      // test('alerts if user does not exist', () => {
      //   const alertSpy = jest
      //     .spyOn(window, 'alert')
      //     .mockImplementation(() => {});
      //   const { component } = setupTestingModule();

      //   component.userName = 'Invalid user';

      //   component.submit();

      //   expect(alertSpy).toHaveBeenCalledWith(
      //     'Nie ma takiej osoby na liście. Sprawdź poprawność wpisanego imienia. Polskie litery mają znaczenie.'
      //   );
      // });

      /*********************************/
    });
  });

  function setupTestingModule(users = defaultMockUsers) {
    TestBed.configureTestingModule({
      providers: [
        LotteryComponent,
        ListService,
        UserService,
        {
          provide: AngularFirestore,
          useValue: createMockAngularFirestore(users)
        }
      ]
    }).compileComponents();

    const component = TestBed.inject(LotteryComponent);
    const listService = TestBed.inject(ListService);
    const spyUpdateUser = jest
      .spyOn(listService, 'updateUser')
      .mockImplementation();

    component.userName = drawingUserName;

    return { component, listService };
  }

  function setupVisualTestingModule(users = defaultMockUsers) {
    TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule, FormsModule],
      declarations: [LotteryComponent],
      providers: [
        ListService,
        UserService,
        {
          provide: AngularFirestore,
          useValue: createMockAngularFirestore(users)
        }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(LotteryComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    // const component = TestBed.inject(LotteryComponent);
    const listService = TestBed.inject(ListService);
    const spyUpdateUser = jest
      .spyOn(listService, 'updateUser')
      .mockImplementation();

    component.userName = drawingUserName;

    return { component, listService, fixture };
  }
});

const drawingUserName = 'aleksander';
const userToDrawName = 'janina';

const drawingUserData = { draw: '', isDrawn: false };
const userToDrawData = { draw: '', isDrawn: false };

const defaultMockUsers: MockUser[] = [
  {
    name: drawingUserName,
    data: drawingUserData
  },
  {
    name: userToDrawName,
    data: userToDrawData
  }
];

// const mock = [
//   {
//     payload: {
//       doc: {
//         id: drawingUserName,
//         data: () => drawingUserData,
//       },
//     },
//   },
//   {
//     payload: {
//       doc: {
//         id: userToDrawName,
//         data: () => userToDrawData,
//       },
//     },
//   },
// ];
